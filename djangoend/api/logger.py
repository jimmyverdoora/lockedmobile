from djangoend.settings import LOG_FILE
import functools
import logging

logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(levelname)s %(asctime)s %(message)s')

def logThis(function):

    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        try:
            logging.info("REQUEST to " + function.__name__ + ": " + str(args[0]) + ", POST: " + str(args[0].POST))
        except Exception:
            logging.warn("Unable to log the request", exc_info=True)
        result = function(*args, **kwargs)
        try:
            logging.info("RESPONSE: " + str(result.content))
        except Exception:
            logging.warn("Unable to log the response", exc_info=True)
        return result

    return wrapper