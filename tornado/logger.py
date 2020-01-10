from settings import LOG_FILE
import functools
import logging
import uuid
from logging.handlers import TimedRotatingFileHandler

logging.basicConfig(format='%(levelname)s %(asctime)s %(message)s')
LOGGERONE = logging.getLogger("TornadoLogger")
LOGGERONE.addHandler(TimedRotatingFileHandler(LOG_FILE, when="midnight", interval=1, backupCount=7))
LOGGERONE.setLevel(logging.INFO)

class Logger(object):

    @staticmethod
    def logRequest(obj, guid):
        try:
            LOGGERONE.info("REQUEST  [" + guid + "] " + str(obj.request.method) + " " + str(obj.request.uri) +
                " FROM " + str(obj.request.remote_ip) + " UA: " + str(obj.request.headers._dict['User-Agent']) + 
                " | CONTENT: " + str(obj.request.arguments))
        except Exception:
            LOGGERONE.warn("Unable to log the request", exc_info=True)

    @staticmethod
    def logResponse(obj, guid):
        try:
            LOGGERONE.info("RESPONSE [" + guid + "] " + str(obj._write_buffer))
        except Exception:
            LOGGERONE.warn("Unable to log the response", exc_info=True)
