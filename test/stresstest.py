import requests
import time
import random
from threading import Thread

BASEURL = 'http://142.93.102.210:8080'

MAX_SECONDS_MOVE = 5

# loop sequence 1U 5U 2D 4D 2U 5D

def launchASingleInfiniteGame(i):
    r = requests.get(BASEURL + '/host')
    d = r.json()
    number = d['number']
    t1 = Thread(target=hostPlayer(i/2, number), args=(i,))
    t2 = Thread(target=joinPlayer(number), args=(i+1,))
    t1.start()
    time.sleep(3000)
    t2.start()


def hostPlayer(i, number):
    r = requests.post(BASEURL + '/host', data={'number': number})
    d = r.json()
    print("GAME " + str(i) + " HAS STARTED")
    g = d['gameId']
    mid = 1
    if d['goFirst']:
        playFirstPlayer(g)
    else:
        playSecondPlayer(g)


def joinPlayer(number):
    number = int(sys.argv[1])
    r = requests.post(BASEURL + '/join', data={'number': number})
    d = r.json()
    g = d['gameId']
    mid = 1
    if d['goFirst']:
        playFirstPlayer(g)
    else:
        playSecondPlayer(g)

    
def playFirstPlayer(g):
    moves = ["1U", "2D", "2U"]
    index = 0
    mid = 1
    while True:
        r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                            'gameId': g,
                                            'moveId': mid,
                                            'move': moves[index]})
        d = r.json()
        mid += 1

        r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                                'gameId': g,
                                                'moveId': mid})
        d = r.json()
        mid += 1

        index += 1
        if index > 2:
            index = 0

        time.sleep(random.random() * MAX_SECONDS_MOVE)

def playSecondPlayer(g):
    moves = ["5U", "4D", "5D"]
    index = 0
    r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                                'gameId': g,
                                                'moveId': 1})
    d = r.json()
    mid = 2
    while True:
        time.sleep(random.random() * MAX_SECONDS_MOVE)

        r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                            'gameId': g,
                                            'moveId': mid,
                                            'move': moves[index]})
        d = r.json()
        mid += 1

        r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                                'gameId': g,
                                                'moveId': mid})
        d = r.json()
        mid += 1

        index += 1
        if index > 2:
            index = 0

        

launchASingleInfiniteGame(1)
