import json
import random
import tornado.locks
import uuid
import time
from tornado import gen
from tornado.httpclient import AsyncHTTPClient

HEADERS = {"content-type": "application/x-www-form-urlencoded",
           "charset": "UTF-8"}
DJANGO_API_URL = "http://localhost:8000"


class LobbyManager(object):

    def  __init__(self):
        self.numbers = dict()
        self.conds = dict()

    def createNew(self):
        number = random.randint(100000, 999999)
        while number in self.numbers.keys():
            number = random.randint(100000, 999999)
        self.numbers[number] = str(uuid.uuid4())
        self.conds[number] = tornado.locks.Condition()
        return number

    def clear(self, n):
        try:
            del self.numbers[n]
            del self.conds[n]
        except Exception:
            pass


class GameManager(object):

    def __init__(self):
        self.cli = AsyncHTTPClient()
        self.conds = dict()

    @gen.coroutine
    def createNew(self, gameId):
        self.conds[gameId] = tornado.locks.Condition()
        response = yield self.cli.fetch(DJANGO_API_URL + "/game/" + gameId + "/create",
                       headers=HEADERS,
                       method="GET")
        return json.loads(response.body)

    def clear(self, gameId):
        try:
            del self.conds[gameId]
        except Exception:
            pass

    @gen.coroutine
    def getMove(self, gameId, moveId):
        response = yield self.cli.fetch(DJANGO_API_URL + "/game/" + gameId + "/move/" +
               str(moveId),
               headers=HEADERS,
               method="GET")
        return json.loads(response.body)

    @gen.coroutine
    def putMove(self, gameId, moveId, move):
        body = "move=" + move
        response = yield self.cli.fetch(DJANGO_API_URL + "/game/" + gameId + "/move/" +
               str(moveId),
               headers=HEADERS,
               method="POST",
               body=body)
        return json.loads(response.body)
