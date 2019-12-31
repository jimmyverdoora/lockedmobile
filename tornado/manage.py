import requests
from settings import *
import sys

BASEURL = 'http://localhost:' + str(DEPLOY_PORT)


def clearIps():
    r = requests.post(BASEURL + '/clearlobbies', data={'key': TORNADO_KEY})
    print(r.json())



comand = sys.argv[1]
if comand == "clearips":
    clearIps()