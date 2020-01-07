import requests

BASEURLC = 'http://142.93.102.210:8080'
BASEURL = "http://localhost:8080"

r = requests.get(BASEURL + '/host')
d = r.json()
print("P1 created game: " + str(d))

r = requests.post(BASEURL + '/host', data={'number': d['number']})
d = r.json()
print("P2 arrived, game begins: " + str(d))
g = d['gameId']

r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                           'gameId': g,
                                           'moveId': 1,
                                           'move': "1U"})
d = r.json()
print("P1 made first move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                           'gameId': g,
                                           'moveId': 2})
d = r.json()
print("P1 received second move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                           'gameId': g,
                                           'moveId': 3,
                                           'move': "3L"})
d = r.json()
print("P1 made third move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "ASK",
                                           'gameId': g,
                                           'moveId': 4})
d = r.json()
print("P1 received fourth move: " + str(d))

r = requests.post(BASEURL + '/game', data={'requestType': "PUT",
                                           'gameId': g,
                                           'moveId': 5,
                                           'move': "2D"})
d = r.json()
print("P1 made fifth move: " + str(d))
