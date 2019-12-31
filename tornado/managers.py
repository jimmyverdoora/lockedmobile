import json
import logging
import random
import tornado.locks
import uuid
import time
from settings import *
from tornado import gen
from tornado.httpclient import AsyncHTTPClient


class LobbyManager(object):

    def  __init__(self):
        self.numbers = dict()
        self.firstPlayerHost = dict()
        self.conds = dict()
        self.ips = dict()

    def createNew(self, hostIp):
        number = random.randint(100000, 999999)
        while number in self.numbers.keys():
            number = random.randint(100000, 999999)
        self.checkIpSafety(hostIp, number)
        self.numbers[number] = str(uuid.uuid4())
        self.conds[number] = tornado.locks.Condition()
        return number

    def clear(self, n):
        try:
            del self.numbers[n]
            del self.firstPlayerHost[n]
            del self.conds[n]
        except Exception:
            pass
    
    def checkIpSafety(self, hostIp, n):
        print(self.numbers)
        if hostIp not in self.ips.keys():
            self.ips[hostIp] = [n]
            return
        if len(self.ips[hostIp]) >= IP_LOBBIES_THRESHOLD:
            for i in self.ips[hostIp]:
                self.clear(i)
            self.ips[hostIp] = [n]
            logging.warning("IP " + hostIp + " reached the lobbies threshold!")
            return
        self.ips[hostIp].append(n)

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
        logging.info("CLEARING GAME: " + str(gameId) + ", ACTIVE GAMES: " + str(len(self.conds)))
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
