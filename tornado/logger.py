from settings import LOG_FILE
import functools
import logging
import time
import uuid

logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(levelname)s %(asctime)s %(message)s')

def logThis(function):

    @functools.wraps(function)
    def wrapper(self, *args, **kwargs):
        guid = str(uuid.uuid4())
        try:
            logging.info("REQUEST  [" + guid + "] " + str(self.request.method) + " " + str(self.request.uri) +
                " FROM " + str(self.request.remote_ip) + " UA: " + str(self.request.headers._dict['User-Agent']) + 
                " | CONTENT: " + str(self.request.arguments))
        except Exception:
            logging.warn("Unable to log the request", exc_info=True)
        start = time.time()
        result = function(self, *args, **kwargs)
        t = str(round(time.time() - start))
        try:
            logging.info("RESPONSE [" + guid + "] TIME: " + t + "ms | CONTENT: " + str(self._write_buffer))
        except Exception:
            logging.warn("Unable to log the response", exc_info=True)
        return result

    return wrapper