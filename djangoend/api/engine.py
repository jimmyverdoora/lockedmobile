import logging
from api.models import Move

OPPOSITES = {"U": "D", "D": "U", "L": "R", "R": "L"}


def makeMove(game, moves, pieces, moveId, move):
    if not move or len(moves) != moveId - 1 or len(move) != 2:
        return "KO", ""
    movables = ("1", "2", "3") if moveId % 2 == 1 else ("4", "5", "6")
    if move[0] not in movables or move[1] not in ("U", "D", "L", "R"):
        return "KO", ""
    possible, piecesToMove = isMovePossible(move, pieces, movables)
    if possible:
        print("POSSIBLE")
        success, forbiddenMove = completeMove(move[1], piecesToMove)
        if success:
            print("SUCCESS")
            Move.objects.create(value=move,
                                number=moveId,
                                game=game)
            return "OK", forbiddenMove
    return "KO", ""


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


def completeMove(direction, pieces):
    try:
        forbiddenMove = ""
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
            piece.save()
        return True, forbiddenMove
    except Exception as e:
        logging.error("Exception occurred", exc_info=True)
        return False, None


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
