import json
import logging
import random
import tornado.locks
import uuid
import time
from datetime import datetime, timedelta
from settings import *
from tornado import gen
from tornado.httpclient import AsyncHTTPClient


class LobbyManager(object):

    def  __init__(self):
        self.numbers = dict()
        self.firstPlayerHost = dict()
        self.conds = dict()
        self.ips = dict()
        self.ipLastUpdate = dict()

    def createNew(self, hostIp):
        number = random.randint(100000, 999999)
        while number in self.numbers.keys():
            number = random.randint(100000, 999999)
        self.checkIpSafety(hostIp, number)
        self.numbers[number] = str(uuid.uuid4())
        self.conds[number] = tornado.locks.Condition()
        return number

    def clear(self, n, removeFromIps=True, hint=None):
        try:
            del self.numbers[n]
            del self.firstPlayerHost[n]
            del self.conds[n]
            if removeFromIps:
                if hint is not None:
                    try:
                        self.ips[hint].remove(n)
                        if len(self.ips[hint]) == 0:
                            del self.ips[hint]
                        return
                    except Exception:
                        pass
                targetIp = None
                for ip, numbers in self.ips.items():
                    if n in numbers:
                        targetIp = ip
                        break
                if targetIp is not None:
                    self.ips[targetIp].remove(n)
                    if len(self.ips[targetIp]) == 0:
                        del self.ips[targetIp]
        except Exception:
            pass

    def checkIpSafety(self, hostIp, n):
        self.ipLastUpdate[hostIp] = datetime.now()
        if hostIp not in self.ips.keys():
            self.ips[hostIp] = {n}
            return
        if len(self.ips[hostIp]) >= IP_LOBBIES_THRESHOLD:
            for i in self.ips[hostIp]:
                self.clear(i, removeFromIps=False)
            self.ips[hostIp] = {n}
            logging.warning("IP " + hostIp + " reached the lobbies threshold!")
            return
        self.ips[hostIp].add(n)
    
    def clearInactiveIps(self):
        now = datetime.now()
        afkIp = []
        totLobbies = 0
        for ip, date in self.ipLastUpdate.items():
            if now < date + timedelta(seconds=MAX_LOBBY_DURATION_SECONDS):
                continue
            for i in self.ips[ip]:
                self.clear(i, removeFromIps=False)
                totLobbies += 1
            del self.ips[ip]
            afkIp.append(ip)
        for ip in afkIp:
            del self.ipLastUpdate[ip]
        logging.info("DELETED " + str(len(afkIp)) + " for a total of " + str(totLobbies) + " lobbies")
        return totLobbies


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
            return True
        except Exception:
            return False

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

    @gen.coroutine
    def getVersion(self):
        response = yield self.cli.fetch(DJANGO_API_URL + "/version",
               headers=HEADERS,
               method="GET")
        return json.loads(response.body)

    @gen.coroutine
    def getNews(self):
        response = yield self.cli.fetch(DJANGO_API_URL + "/news",
               headers=HEADERS,
               method="GET")
        return json.loads(response.body)