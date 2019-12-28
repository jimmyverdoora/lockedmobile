import logging
from api.models import Move

OPPOSITES = {"U": "D", "D": "U", "L": "R", "R": "L"}
T_SPOTS = {"1": (6, 2), "2": (2, 2), "3": (2, 7), "4": (6, 7)}


def makeMove(game, moves, pieces, moveId, move):
    if not move or len(moves) != moveId - 1:
        return "KO"
    teleport = ""
    if len(move) == 3:
        teleport = move[2]
        move = move[:2]
    movables = ("1", "2", "3") if moveId % 2 == 1 else ("4", "5", "6")
    if move[0] not in movables or move[1] not in ("U", "D", "L", "R"):
        return "KO"
    possible, piecesToMove = isMovePossible(move, pieces, movables)
    if not possible:
        return "KO"
    success, forbiddenMove, toBeTeleported = completeMove(move[1], piecesToMove)
    if not success:
        return "KO"
    if (toBeTeleported is not None and not teleport) or (toBeTeleported is None) and (teleport):
        return "KO"
    if teleport and not performTeleport(toBeTeleported, teleport, pieces):
        return "KO"
    Move.objects.create(value=move+teleport,
                        number=moveId,
                        game=game)
    game.currentForbidden = forbiddenMove
    game.save()
    return "OK"


def checkWin(game):
    pieces = game.pieces.filter(player=1)
    if checkHoriz(pieces) or checkVert(pieces):
        game.state = 1
        game.save()
        return 1
    pieces = game.pieces.filter(player=-1)
    if checkHoriz(pieces) or checkVert(pieces):
        game.state = -1
        game.save()
        return -1
    return 0


def performTeleport(toBeTeleported, teleportSpot, pieces):
    if teleportSpot not in T_SPOTS.keys():
        return False
    busySpots = []
    for piece in pieces:
        for k in T_SPOTS.keys():
            if T_SPOTS[k][0] == piece.x and T_SPOTS[k][1] == piece.y:
                busySpots.append(k)
                break
    if len(busySpots) == 4:
        # Unlikely situation where every spot is busy
        return True
    if teleportSpot in busySpots:
        return False
    piece.x = T_SPOTS[teleportSpot][0]
    piece.y = T_SPOTS[teleportSpot][1]
    piece.save()
    return True


def completeMove(direction, pieces):
    try:
        forbiddenMove = None
        toBeTeleported = None
        if len(pieces) == 2:
            forbiddenMove = str(pieces[1].number) + OPPOSITES[direction]
        for piece in pieces:
            if direction == "U":
                piece.y -= 1
            elif direction == "D":
                piece.y += 1
            elif direction == "L":
                piece.x -= 1
            elif direction == "R":
                piece.x += 1
            else:
                raise Exception("Wrong direction")
            for tup in T_SPOTS.values():
                if piece.x == tup[0] and piece.y == tup[1]:
                    toBeTeleported = piece
                    forbiddenMove = None
                    break
            piece.save()
        return True, forbiddenMove, toBeTeleported
    except Exception as e:
        logging.error("Exception occurred", exc_info=True)
        return False, None, None


def checkHoriz(pieces):
    if pieces[0].y != pieces[1].y or pieces[0].y != pieces[2].y:
        return False
    if (pieces[0].x == pieces[1].x + 1):
        return pieces[2].x == pieces[0].x + 1 or pieces[2].x == pieces[1].x - 1
    if (pieces[1].x == pieces[0].x + 1):
        return pieces[2].x == pieces[1].x + 1 or pieces[2].x == pieces[0].x - 1
    return abs(pieces[0].x - pieces[1].x) == 2 and\
        pieces[2].x * 2 == pieces[0].x + pieces[1].x


def checkVert(pieces):
    if pieces[0].x != pieces[1].x or pieces[0].x != pieces[2].x:
        return False
    if (pieces[0].y == pieces[1].y + 1):
        return pieces[2].y == pieces[0].y + 1 or pieces[2].y == pieces[1].y - 1
    if (pieces[1].y == pieces[0].y + 1):
        return pieces[2].y == pieces[1].y + 1 or pieces[2].y == pieces[0].y - 1
    return abs(pieces[0].y - pieces[1].y) == 2 and\
        pieces[2].y * 2 == pieces[0].y + pieces[1].y


def isMovePossible(move, pieces, friendlyPiecesNumbers):
    currentPiece = None
    friendly = []
    opponent = []
    for piece in pieces:
        if piece.number == int(move[0]):
            currentPiece = piece
        if piece.number in friendlyPiecesNumbers:
            friendly.append(piece)
        else:
            opponent.append(piece)
    if currentPiece is None:
        return False, None
    if move[1] == "U":
        newY = currentPiece.y - 1
        if newY < 1:
            return False, None
        for piece in friendly:
            if piece.y == newY and piece.x == currentPiece.x:
                return False, None
        for piece in opponent:
            if piece.y == newY and piece.x == currentPiece.x:
                if newY == 1:
                    return False, None
                for piece2 in pieces:
                    if piece2.y == newY - 1 and piece2.x == currentPiece.x:
                        return False, None
                return True, [currentPiece, piece]
        return True, [currentPiece]
    if move[1] == "D":
        newY = currentPiece.y + 1
        if newY > 8:
            return False, None
        for piece in friendly:
            if piece.y == newY and piece.x == currentPiece.x:
                return False, None
        for piece in opponent:
            if piece.y == newY and piece.x == currentPiece.x:
                if newY == 8:
                    return False, None
                for piece2 in pieces:
                    if piece2.y == newY + 1 and piece2.x == currentPiece.x:
                        return False, None
                return True, [currentPiece, piece]
        return True, [currentPiece]
    if move[1] == "L":
        newX = currentPiece.x - 1
        if newX < 1:
            return False, None
        for piece in friendly:
            if piece.x == newX and piece.y == currentPiece.y:
                return False, None
        for piece in opponent:
            if piece.x == newX and piece.y == currentPiece.y:
                if newX == 1:
                    return False, None
                for piece2 in pieces:
                    if piece2.x == newX - 1 and piece2.y == currentPiece.y:
                        return False, None
                return True, [currentPiece, piece]
        return True, [currentPiece]
    if move[1] == "R":
        newX = currentPiece.x + 1
        if newX > 7:
            return False, None
        for piece in friendly:
            if piece.x == newX and piece.y == currentPiece.y:
                return False, None
        for piece in opponent:
            if piece.x == newX and piece.y == currentPiece.y:
                if newX == 7:
                    return False, None
                for piece2 in pieces:
                    if piece2.x == newX + 1 and piece2.y == currentPiece.y:
                        return False, None
                return True, [currentPiece, piece]
        return True, [currentPiece]
