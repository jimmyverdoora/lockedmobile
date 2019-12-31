import requests
import sys

BASEURL = 'http://localhost:'

TORNADO_KEY = '*4p1lme^9dxj3(-+f+3vzo47e9(0i*=-57k=0^ho&49re!qyyh'

def clearIps():
    r = requests.post(BASEURL + '8080/clearlobbies', data={'key': TORNADO_KEY})
    print(r.json())

def storicizeGames():
    r = requests.post(BASEURL + '8000/storicize', data={'key': TORNADO_KEY})
    print(r.json())

def statistics():
    r = requests.post(BASEURL + '8080/stats', data={'key': TORNADO_KEY})
    print("TORNADO:")
    print(r.json())
    r = requests.post(BASEURL + '8000/stats', data={'key': TORNADO_KEY})
    print("DJANGO:")
    print(r.json())

comand = sys.argv[1]
if comand == "clearips":
    clearIps()
if comand == "storicize":
    storicizeGames()
if comand == "stats":
    statistics()