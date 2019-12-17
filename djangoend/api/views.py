from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.models import Game, Move, Piece
from api.engine import checkWin, makeMove
import logging

# Create your views here.

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
