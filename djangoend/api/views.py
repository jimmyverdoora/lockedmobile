from datetime import timedelta
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from djangoend.settings import *
from api.models import *
from api.engine import checkWin, makeMove
from api.logger import logThis
import logging


# TODO: when making competitive games, each player will have a secret key which is checked before making a move
@logThis
def createApi(request, gameId):
    try:
        game = Game.objects.create(guid=str(gameId),
                            state=0)
        Piece.objects.create(number=1, player=-1, x=3, y=5, game=game)
        Piece.objects.create(number=2, player=-1, x=4, y=3, game=game)
        Piece.objects.create(number=3, player=-1, x=5, y=5, game=game)
        Piece.objects.create(number=4, player=1, x=3, y=4, game=game)
        Piece.objects.create(number=5, player=1, x=4, y=6, game=game)
        Piece.objects.create(number=6, player=1, x=5, y=4, game=game)
    except Exception:
        logging.error("Exception occurred", exc_info=True)
        return JsonResponse({"outcome": "KO"})
    return JsonResponse({"outcome": "OK", "gameId": gameId})


@csrf_exempt
@logThis
def moveApi(request, gameId, moveId):
    if request.method == 'GET':
        try:
            game = Game.objects.filter(guid=str(gameId))[0]
            move = Move.objects.filter(game=game, number=moveId)[0]
            return JsonResponse({"outcome": "OK",
                                 "move": move.value,
                                 "forbiddenMove": game.currentForbidden,
                                 "win": game.state})
        except Exception as e:
            logging.error("Exception occurred", exc_info=True)
            return JsonResponse({"outcome": "KO"})
    elif request.method == "POST":
        try:
            game = Game.objects.prefetch_related('moves', 'pieces').filter(
                guid=str(gameId))[0]
            move = request.POST.get("move", "")
            outcome = makeMove(game, game.moves.all(),
                                game.pieces.all(), moveId, move)
            win = checkWin(game)
            return JsonResponse({"outcome": outcome,
                                 "win": win})
        except Exception as e:
            logging.error("Exception occurred", exc_info=True)
            return JsonResponse({"outcome": "KO"})
    else:
        return JsonResponse({"outcome": "KO"})


@csrf_exempt
def dailyStoricizationAndReport(request):
    if request.method != 'POST':
        return JsonResponse({"outcome": "KO", "reason": "WRONG METHOD"})
    key = request.POST.get("key", "")
    if key != TORNADO_KEY:
        return JsonResponse({"outcome": "KO", "reason": "WRONG KEY"})
    games = Game.objects.all()
    totGames = len(games)
    completedGames = len(games.filter(state=-1)) + len(games.filter(state=1))
    DailyReport.objects.create(totGames=totGames, completedGames=completedGames)
    gameIds = []
    for game in games:
        if (game.state == -1 or game.state == 1 or
                timezone.now() > game.modifiedAt + timedelta(seconds=GAME_MAX_INACTIVE_TIME_SECONDS)):
            gameIds.append(game.guid)
            game.storicize()
            game.delete()
    return JsonResponse({"outcome": "OK", "total": totGames, "cleared": totGames - len(Game.objects.all()),
                         "gameIds": gameIds})


@csrf_exempt
def statsApi(request):
    if request.method != 'POST':
        return JsonResponse({"outcome": "KO", "reason": "WRONG METHOD"})
    key = request.POST.get("key", "")
    if key != TORNADO_KEY:
        return JsonResponse({"outcome": "KO", "reason": "WRONG KEY"})
    games = Game.objects.all()
    totGames = len(games)
    completedGames = len(games.filter(state=-1)) + len(games.filter(state=1))
    inactiveLimit = timezone.now() - timedelta(seconds=GAME_MAX_INACTIVE_TIME_SECONDS)
    inactiveGames = len(games.filter(state=0, modifiedAt__lt=inactiveLimit))
    return JsonResponse({"outcome": "OK", "total": totGames, "completed": completedGames,
            "active": totGames - completedGames - inactiveGames, "inactive": inactiveGames})


@csrf_exempt
def versionApi(request):
    try:
        if request.method == 'POST':
            key = request.POST.get("key", "")
            if key != TORNADO_KEY:
                return JsonResponse({"outcome": "KO", "reason": "WRONG KEY"})
            version = request.POST.get("version", "")
            linkA = request.POST.get("linkAndroid", "")
            linkI = request.POST.get("linkIos", "")
            if not version or not linkA or not linkI:
                return JsonResponse({"outcome": "KO", "reason": "WRONG DATA"})
            result = Valore.objects.filter(chiave="VERSION")
            if len(result) == 0:
                Valore.objects.create(chiave="VERSION", valore=version, active=True)
                Valore.objects.create(chiave="LINK_ANDROID", valore=linkA, active=True)
                Valore.objects.create(chiave="LINK_IOS", valore=linkI, active=True)
            else:
                currentVersion = result[0]
                currentVersion.valore = version
                currentVersion.save()
                currentLinkA = Valore.objects.filter(chiave="LINK_ANDROID")
                currentLinkA.valore = linkA
                currentLinkA.save()
                currentLinkI = Valore.objects.filter(chiave="LINK_IOS")
                currentLinkI.valore = linkI
                currentLinkI.save()
            return JsonResponse({"outcome": "OK", "version": version, "linkAndroid": linkA, "linkIos": linkI})
        else:
            version = Valore.objects.filter(chiave=VERSION_KEY)[0].valore
            linkAndroid = Valore.objects.filter(chiave=LINK_ANDROID_KEY)[0].valore
            linkIos = Valore.objects.filter(chiave=LINK_IOS_KEY)[0].valore
            return JsonResponse({"outcome": "OK", "version": version, "linkAndroid": linkAndroid, "linkIos": linkIos})
    except Exception:
        logging.error("Exception occurred", exc_info=True)
        return JsonResponse({"outcome": "KO"})
