import asyncio
import json
import random
import tornado.ioloop
import tornado.locks
import tornado.web
import os.path
import uuid

from logger import LOGGERONE, Logger 
from managers import GameManager, LobbyManager
from settings import *
from tornado.options import parse_command_line


globalLobbyManager = LobbyManager()
globalGameManager = GameManager()


class HostHandler(tornado.web.RequestHandler):

    def get(self):
        guid = str(uuid.uuid4())
        Logger.logRequest(self, guid)
        try:
            n = globalLobbyManager.createNew(self.request.remote_ip)
            self.write(json.dumps({'number': n, "outcome": "OK"}))
            Logger.logResponse(self, guid)
        except Exception:
            LOGGERONE.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))

    async def post(self):
        guid = str(uuid.uuid4())
        Logger.logRequest(self, guid)
        try:
            n = int(self.get_argument("number"))
            gameId = globalLobbyManager.numbers.get(n)
            if gameId is None:
                self.write(json.dumps({"outcome": "KO"}))
                Logger.logResponse(self, guid)
                return
            waitFuture = globalLobbyManager.conds.get(n).wait()
            try:
                await waitFuture
            except Exception:
                globalLobbyManager.clear(n, hint=self.request.remote_ip)
                self.write(json.dumps({"outcome": "KO"}))
                Logger.logResponse(self, guid)
                return
            goFirst = globalLobbyManager.firstPlayerHost[n]
            globalLobbyManager.clear(n, hint=self.request.remote_ip)
            self.write(json.dumps({"gameId": gameId, "outcome": "OK", "goFirst": goFirst}))
            Logger.logResponse(self, guid)
        except Exception:
            LOGGERONE.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))
            Logger.logResponse(self, guid)
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


class JoinHandler(tornado.web.RequestHandler):

    async def post(self):
        guid = str(uuid.uuid4())
        Logger.logRequest(self, guid)
        try:
            n = int(self.get_argument("number"))
            gameId = globalLobbyManager.numbers.get(n)
            if gameId is None:
                self.write(json.dumps({"outcome": "OK", "numberFound": False}))
                Logger.logResponse(self, guid)
                return
            jsonResult = await globalGameManager.createNew(gameId)
            goFirst = True if random.random() < 0.5 else False
            globalLobbyManager.firstPlayerHost[n] = not goFirst
            globalLobbyManager.conds.get(n).notify_all()
            jsonResult["goFirst"] = goFirst
            jsonResult["numberFound"] = True
            self.write(json.dumps(jsonResult))
            Logger.logResponse(self, guid)
        except Exception:
            LOGGERONE.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))
            Logger.logResponse(self, guid)

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


class ClearLobbyHandler(tornado.web.RequestHandler):
    
    def post(self):
        try:
            key = str(self.get_argument("key"))
            if key != TORNADO_KEY:
                self.write(json.dumps({"outcome": "KO", "reason": "WRONG KEY"}))
                return
            n = globalLobbyManager.clearInactiveIps()
            self.write(json.dumps({'cleared': n, "outcome": "OK"}))
        except Exception as e:
            LOGGERONE.error("Exception raised", exc_info=True)
            self.write(json.dumps({"outcome": "KO", "reason": "EXCEPTION: " + str(e)}))

class GameHandler(tornado.web.RequestHandler):

    async def post(self):
        guid = str(uuid.uuid4())
        Logger.logRequest(self, guid)
        gameId = str(self.get_argument("gameId", ""))
        try:
            requestType = str(self.get_argument("requestType"))
            moveId = int(self.get_argument("moveId"))
            if requestType == "ASK":
                waitFuture = globalGameManager.conds.get(gameId).wait()
                try:
                    await waitFuture
                except asyncio.CancelledError:
                    globalGameManager.clear(gameId)
                    self.write(json.dumps({"outcome": "KO", "reason": "Canceled"}))
                    Logger.logResponse(self, guid)
                    return
                moveDict = await globalGameManager.getMove(gameId, moveId)
                self.write(json.dumps(moveDict))
                Logger.logResponse(self, guid)
            elif requestType == "PUT":
                move = str(self.get_argument("move"))
                jsonResult = await globalGameManager.putMove(gameId, moveId, move)
                globalGameManager.conds.get(gameId).notify_all()
                if jsonResult["win"] != 0:
                    globalGameManager.clear(gameId)
                self.write(json.dumps(jsonResult))
                Logger.logResponse(self, guid)
        except Exception:
            LOGGERONE.error("Exception occurred", exc_info=True)
            globalGameManager.clear(gameId)
            self.write(json.dumps({"outcome": "KO"}))
            Logger.logResponse(self, guid)
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


class StatsHandler(tornado.web.RequestHandler):
    
    def post(self):
        try:
            key = str(self.get_argument("key"))
            if key != TORNADO_KEY:
                self.write(json.dumps({"outcome": "KO", "reason": "WRONG KEY"}))
                return
            self.write(json.dumps({"outcome": "OK",
                                   "lobbies": len(globalLobbyManager.numbers),
                                   "ips": len(globalLobbyManager.ips),
                                   "games": len(globalGameManager.conds)}))
        except Exception as e:
            self.write(json.dumps({"outcome": "KO", "reason": "EXCEPTION: " + str(e)}))


class GameKillHandler(tornado.web.RequestHandler):
    
    def post(self):
        try:
            key = str(self.get_argument("key"))
            if key != TORNADO_KEY:
                self.write(json.dumps({"outcome": "KO", "reason": "WRONG KEY"}))
                return
            games = self.get_argument("gameIds").split('|')
            killed = 0
            for gameId in games:
                if globalGameManager.clear(gameId):
                    killed += 1
            self.write(json.dumps({"outcome": "OK",
                                   "killed": killed}))
        except Exception as e:
            LOGGERONE.error("Exception raised", exc_info=True)
            self.write(json.dumps({"outcome": "KO", "reason": "EXCEPTION: " + str(e)}))


class VersionHandler(tornado.web.RequestHandler):

    async def get(self):
        try:
            data = await globalGameManager.getVersion()
            if not data["version"] or not data["linkAndroid"] or not data["linkIos"]:
                LOGGERONE.error("Django version api returned corrupted data")
                self.write(json.dumps({"outcome": "KO"}))
                return
            self.write(json.dumps({"version": data["version"], "linkAndroid": data["linkAndroid"],
                    "linkIos": data["linkIos"]}))
        except Exception:
            LOGGERONE.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


class NewsHandler(tornado.web.RequestHandler):

    async def get(self):
        try:
            data = await globalGameManager.getNews()
            self.write(json.dumps(data))
        except Exception:
            LOGGERONE.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


def main():
    if DEBUG:
        parse_command_line()
        app = tornado.web.Application(
            [
                (r"/host", HostHandler),
                (r"/join", JoinHandler),
                (r"/game", GameHandler),
                (r"/stats", StatsHandler),
                (r"/clearlobbies", ClearLobbyHandler),
                (r"/killinactive", GameKillHandler),
                (r"/version", VersionHandler),
                (r"/news", NewsHandler),
            ],
            debug=True,
        )
        app.listen(DEPLOY_PORT)
        tornado.ioloop.IOLoop.current().start()
    else:
        app = tornado.web.Application(
            [
                (r"/host", HostHandler),
                (r"/join", JoinHandler),
                (r"/game", GameHandler),
                (r"/stats", StatsHandler),
                (r"/clearlobbies", ClearLobbyHandler),
                (r"/killinactive", GameKillHandler),
                (r"/version", VersionHandler),
                (r"/news", NewsHandler),
            ],
            debug=False,
        )
        server = tornado.httpserver.HTTPServer(app)
        server.bind(DEPLOY_PORT)
        server.start(0)  # forks one process per cpu
        tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
    globalGameManager.init()
