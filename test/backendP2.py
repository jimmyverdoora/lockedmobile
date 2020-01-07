import requests
import sys

BASEURLC = 'http://142.93.102.210:8080'
BASEURL = "http://localhost:8080"


number = int(sys.argv[1])
r = requests.post(BASEURL + '/join', data={'number': number})
d = r.json()
print("P2 entered game: " + str(d))
g = d['gameId']

r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                           'gameId': g,
                                           'moveId': 1})
d = r.json()
print("P2 received first move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                           'gameId': g,
                                           'moveId': 2,
                                           'move': "4R"})
d = r.json()
print("P2 made second move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                           'gameId': g,
                                           'moveId': 3})
d = r.json()
print("P2 received third move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                           'gameId': g,
                                           'moveId': 4,
                                           'move': "5U"})
d = r.json()
print("P2 made fourth move: " + str(d))
r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                           'gameId': g,
                                           'moveId': 5})
d = r.json()
print("P2 received fifth move: " + str(d))
