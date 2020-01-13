from website.settings import LOG_FILE
from django.shortcuts import render
from logging.handlers import TimedRotatingFileHandler
import logging

logging.basicConfig(level=logging.WARN, format='%(levelname)s %(asctime)s %(message)s')
LOGGERONE = logging.getLogger("WebsiteLogger")
handler = TimedRotatingFileHandler(LOG_FILE, when="midnight", interval=1, backupCount=7)
formatter = logging.Formatter('%(levelname)s %(asctime)s %(message)s')
handler.setFormatter(formatter)
LOGGERONE.addHandler(handler)
LOGGERONE.setLevel(logging.INFO)
LOGGERONE.propagate = False


def homePageView(request):
    context = {}
    try:
        r = requests.get('http://lockedapi.advenagames.com:8080/version')
        if r.status_code != 200:
            LOGGERONE.error(r.__dict__)
            raise Exception()
        context = r.json()
    except Exception:
        LOGGERONE.error("Exception raised", exc_info=True)
        context["version"] = "???"
        context["linkAndroid"] = "#"
        context["linkIos"] = "#"
    return render(request, "homepage.html", context=context)

def privacyView(request):
    return render(request, "privacy_policy.html")