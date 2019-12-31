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
        # TODO check the ip address in production to avoid ddos
        # make dict that counts the host gets by the same ip which is clear
        # after a number of that IP gets deleted from numbers dict
        try:
            n = globalLobbyManager.createNew()
            self.write(json.dumps({'number': n, "outcome": "OK"}))
        except Exception:
            self.write(json.dumps({"outcome": "KO"}))


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
            self.write(json.dumps({"outcome": "KO"}))
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")


class JoinHandler(tornado.web.RequestHandler):

    async def post(self):
        self.logRequest()
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
            self.logResponse()
        except Exception:
            logging.error("Exception occurred", exc_info=True)
            self.write(json.dumps({"outcome": "KO"}))

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
    
    def logRequest(self):
        pass

    def logResponse(self):
        pass


class GameHandler(tornado.web.RequestHandler):

    async def post(self):
        gameId = str(self.get_argument("gameId", ""))
        self.logRequest()
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
            self.logResponse()
        except Exception:
            logging.error("Exception occurred", exc_info=True)
            globalGameManager.clear(gameId)
            self.write(json.dumps({"outcome": "KO"}))
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
    
    def logRequest(self):
        pass

    def logResponse(self):
        pass


def main():
    if DEBUG:
        parse_command_line()
        app = tornado.web.Application(
            [
                (r"/host", HostHandler),
                (r"/join", JoinHandler),
                (r"/game", GameHandler),
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
            ],
            debug=False,
        )
        server = tornado.httpserver.HTTPServer(app)
        server.bind(DEPLOY_PORT)
        server.start(0)  # forks one process per cpu
        IOLoop.current().start()


if __name__ == "__main__":
    main()
