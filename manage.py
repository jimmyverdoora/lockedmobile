import requests
import sys
import os

BASEURL = 'http://localhost:'

TORNADO_KEY = '*4p1lme^9dxj3(-+f+3vzo47e9(0i*=-57k=0^ho&49re!qyyh'

def clearIps():
    r = requests.post(BASEURL + '8080/clearlobbies', data={'key': TORNADO_KEY})
    print(r.json())

def storicizeGames():
    r = requests.post(BASEURL + '8000/storicize', data={'key': TORNADO_KEY})
    res = r.json()
    print({'outcome': res['outcome'], 'total': res['total'], 'cleared': res['cleared']})
    gameIds = '|'.join(res['gameIds'])
    r = requests.post(BASEURL + '8080/killinactive', data={'key': TORNADO_KEY, 'gameIds': gameIds})
    print(r.json())

def statistics():
    r = requests.post(BASEURL + '8080/stats', data={'key': TORNADO_KEY})
    print("TORNADO:")
    print(r.json())
    r = requests.post(BASEURL + '8000/stats', data={'key': TORNADO_KEY})
    print("DJANGO:")
    print(r.json())

def updateVersion():
    sys.path.insert(0, '/lockedmobile/djangoend/')
    os.environ['DJANGO_SETTINGS_MODULE'] = 'djangoend.settings'

    version = sys.argv[2]
    linkA = sys.argv[3]
    linkI = sys.argv[4]

    from api.models import Valore
    result = Valore.objects.filter(chiave="VERSION")
    if len(result) == 0:
        Valore.objects.create(chiave="VERSION", valore=version, active=True)
        Valore.objects.create(chiave="LINK_ANDROID", valore=linkA, active=True)
        Valore.objects.create(chiave="LINK_IOS", valore=linkI, active=True)
        return
    
    currentVersion = result[0]
    currentVersion.valore = version
    currentVersion.save()
    currentLinkA = Valore.objects.filter(chiave="LINK_ANDROID")
    currentLinkA.valore = linkA
    currentLinkA.save()
    currentLinkI = Valore.objects.filter(chiave="LINK_IOS")
    currentLinkI.valore = linkI
    currentLinkI.save()


comand = sys.argv[1]
if comand == "clearips":
    clearIps()
if comand == "storicize":
    storicizeGames()
if comand == "stats":
    statistics()
if comand == "updateversion":
    updateVersion()