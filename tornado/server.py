import asyncio
import json
import logging
import random
import tornado.ioloop
import tornado.locks
import tornado.web
import os.path

from logger import logThis
from managers import GameManager, LobbyManager
from settings import *
from tornado.options import parse_command_line


globalLobbyManager = LobbyManager()
globalGameManager = GameManager()

logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(levelname)s %(asctime)s %(message)s')


class HostHandler(tornado.web.RequestHandler):

    @logThis
    def get(self):
        try:
            n = globalLobbyManager.createNew(self.request.remote_ip)
            self.write(json.dumps({'number': n, "outcome": "OK"}))
        except Exception:
            logging.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))

    @logThis
    async def post(self):
        try:
            n = int(self.get_argument("number"))
            gameId = globalLobbyManager.numbers.get(n)
            if gameId is None:
                self.write(json.dumps({"outcome": "KO"}))
                return
            waitFuture = globalLobbyManager.conds.get(n).wait()
            try:
                await waitFuture
            except Exception:
                globalLobbyManager.clear(n)
                self.write(json.dumps({"outcome": "KO"}))
                return
            goFirst = globalLobbyManager.firstPlayerHost[n]
            globalLobbyManager.clear(n)
            self.write(json.dumps({"gameId": gameId, "outcome": "OK", "goFirst": goFirst}))
        except Exception:
            logging.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


class JoinHandler(tornado.web.RequestHandler):

    @logThis
    async def post(self):
        try:
            n = int(self.get_argument("number"))
            gameId = globalLobbyManager.numbers.get(n)
            if gameId is None:
                self.write(json.dumps({"outcome": "KO"}))
                return
            jsonResult = await globalGameManager.createNew(gameId)
            goFirst = True if random.random() < 0.5 else False
            globalLobbyManager.firstPlayerHost[n] = not goFirst
            globalLobbyManager.conds.get(n).notify_all()
            jsonResult["goFirst"] = goFirst
            self.write(json.dumps(jsonResult))
        except Exception:
            logging.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))

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
            self.write(json.dumps({"outcome": "KO", "reason": "EXCEPTION: " + str(e)}))

class GameHandler(tornado.web.RequestHandler):

    @logThis
    async def post(self):
        gameId = str(self.get_argument("gameId", ""))
        try:
            requestType = str(self.get_argument("requestType"))
            moveId = int(self.get_argument("moveId"))
            if requestType == "ASK":
                waitFuture = globalGameManager.conds.get(gameId).wait()
                try:
                    await waitFuture
                except asyncio.CancelledError:
                    globalGameManager.clear(n)
                    self.write(json.dumps({"outcome": "KO"}))
                    return
                moveDict = await globalGameManager.getMove(gameId, moveId)
                self.write(json.dumps(moveDict))
            elif requestType == "PUT":
                move = str(self.get_argument("move"))
                jsonResult = await globalGameManager.putMove(gameId, moveId, move)
                globalGameManager.conds.get(gameId).notify_all()
                if jsonResult["win"] != 0:
                    globalGameManager.clear(gameId)
                self.write(json.dumps(jsonResult))
        except Exception:
            logging.error("Exception occurred", exc_info=True)
            globalGameManager.clear(gameId)
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
                (r"/clearlobbies", ClearLobbyHandler),
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
                (r"/clearlobbies", ClearLobbyHandler),
            ],
            debug=False,
        )
        server = tornado.httpserver.HTTPServer(app)
        server.bind(DEPLOY_PORT)
        server.start(0)  # forks one process per cpu
        IOLoop.current().start()


if __name__ == "__main__":
    main()
