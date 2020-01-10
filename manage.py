import requests
import sys
import os
import logging

BASEURL = 'http://localhost:'

TORNADO_KEY = '*4p1lme^9dxj3(-+f+3vzo47e9(0i*=-57k=0^ho&49re!qyyh'

LOG_FILE = "/LOGS/manage.log"

logging.basicConfig(format='%(levelname)s %(asctime)s %(message)s', filename=LOG_FILE, level=logging.INFO)

def clearIps():
    try:
        r = requests.post(BASEURL + '8080/clearlobbies', data={'key': TORNADO_KEY})
        res = r.json()
        if res["outcome"] == "OK":
            logging.info("CLEARING: " + str(res))
        else:
            logging.error("CLEARING: " + str(res))
    except Exception:
        logging.error("CLEARING: ", exc_info=True)

def storicizeGames():
    try:
        r = requests.post(BASEURL + '8000/storicize', data={'key': TORNADO_KEY})
        res = r.json()
        if res["outcome"] != "OK":
            logging.error("STORICIZING: " + str(res))
            return
        logging.info("STORICIZING: " + str({'outcome': res['outcome'], 'total': res['total'], 'cleared': res['cleared']}))
        gameIds = '|'.join(res['gameIds'])
        r = requests.post(BASEURL + '8080/killinactive', data={'key': TORNADO_KEY, 'gameIds': gameIds})
        res = r.json()
        if res["outcome"] == "OK":
            logging.info("STORICIZING: " + str(res))
        else:
            logging.error("STORICIZING: " + str(res))
    except Exception:
        logging.error("STORICIZING: ", exc_info=True)

def statistics():
    r = requests.post(BASEURL + '8080/stats', data={'key': TORNADO_KEY})
    print("TORNADO:")
    print(r.json())
    r = requests.post(BASEURL + '8000/stats', data={'key': TORNADO_KEY})
    print("DJANGO:")
    print(r.json())

def updateVersion(): 
    version = sys.argv[2]
    linkA = sys.argv[3]
    linkI = sys.argv[4]
    r = requests.post(BASEURL + '8000/version', data={'key': TORNADO_KEY, "version": version,
                                                      "linkAndroid": linkA, "linkIos": linkI})
    print(r.json())

def updateNew():
    newContent = sys.argv[2]
    r = requests.post(BASEURL + '8000/news', data={'key': TORNADO_KEY, "newContent": newContent})
    print(r.json())


comand = sys.argv[1]
if comand == "clearips":
    clearIps()
if comand == "storicize":
    storicizeGames()
if comand == "stats":
    statistics()
if comand == "updateversion":
    updateVersion()
if comand == "updatenew":
    updateNew()