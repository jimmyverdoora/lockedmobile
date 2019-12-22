import os
import threading 
import time


def djangoServer(): 
    os.system('python ../djangoend/manage.py runserver')

def tornadoServer():
    os.system('python ../tornado/server.py')

def p1():
    os.system('cordova serve 8001')

def p2():
    os.system('cordova serve 8002')

t1 = threading.Thread(target = djangoServer) 
t1.start() 
t2 = threading.Thread(target = tornadoServer)
t2.start()
os.chdir('../cordovaend')
time.sleep(1)
t3 = threading.Thread(target = p1)
t3.start()
time.sleep(1)
t4 = threading.Thread(target = p2)
t4.start()