from settings import LOG_FILE
import functools
import logging
import uuid

logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(levelname)s %(asctime)s %(message)s')


class Logger(object):

    @staticmethod
    def logRequest(obj, guid):
        try:
            logging.info("REQUEST  [" + guid + "] " + str(obj.request.method) + " " + str(obj.request.uri) +
                " FROM " + str(obj.request.remote_ip) + " UA: " + str(obj.request.headers._dict['User-Agent']) + 
                " | CONTENT: " + str(obj.request.arguments))
        except Exception:
            logging.warn("Unable to log the request", exc_info=True)

    @staticmethod
    def logResponse(obj, guid):
        try:
            logging.info("RESPONSE [" + guid + "] " + str(obj._write_buffer))
        except Exception:
            logging.warn("Unable to log the response", exc_info=True)
