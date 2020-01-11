from djangoend.settings import LOG_FILE
import functools
import logging
from logging.handlers import TimedRotatingFileHandler


logging.basicConfig(level=logging.WARN, format='%(levelname)s %(asctime)s %(message)s')
formatter = logging.Formatter('%(levelname)s %(asctime)s %(message)s')
LOGGERONE = logging.getLogger("DjangoLogger")
LOGGERONE.addHandler(TimedRotatingFileHandler(LOG_FILE, when="midnight", interval=1, backupCount=7))
LOGGERONE.setLevel(logging.INFO)
LOGGERONE.setFormatter(formatter)

def logThis(function):

    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        try:
            LOGGERONE.info("REQUEST to " + function.__name__ + ": " + str(args[0]) + ", POST: " + str(args[0].POST))
        except Exception:
            LOGGERONE.warn("Unable to log the request", exc_info=True)
        result = function(*args, **kwargs)
        try:
            LOGGERONE.info("RESPONSE: " + str(result.content))
        except Exception:
            LOGGERONE.warn("Unable to log the response", exc_info=True)
        return result

    return wrapper