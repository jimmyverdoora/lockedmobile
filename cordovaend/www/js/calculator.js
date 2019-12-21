function createPossibleMoves() {
    selfPieces.forEach(element => {
        var avoid = "";
        if (forbiddenMove && element == forbiddenMove.piece) {
            avoid = forbiddenMove.move;
        };
        if (avoid != "t" && isUpPossible(element)) {
            moves[element].push("t");
        }
        if (avoid != "b" && isDownPossible(element)) {
            moves[element].push("b");
        }
        if (avoid != "l" && isLeftPossible(element)) {
            moves[element].push("l");
        }
        if (avoid != "r" && isRightPossible(element)) {
            moves[element].push("r");
        }
    });
};

function isUpPossible(id) {
    newY = board[id].y - 1;
    if (newY < 1) {
        return false;
    };
    selfPieces.forEach(piece => {
        if (board[piece].y == newY && board[piece].x == board[id].x) {
            return false;
        };
    });
    opponentPieces.forEach(piece => {
        if (board[piece].y == newY && board[piece].x == board[id].x) { 
            if (newY == 1) {
                return false;
            };
            selfPieces.forEach(piece2 => {
                if (board[piece2].y == newY - 1 && board[piece2].x == board[id].x) {
                    return false;
                };
            });
            opponentPieces.forEach(piece2 => {
                if (board[piece2].y == newY - 1 && board[piece2].x == board[id].x) {
                    return false;
                };
            });
            return true;
        };
    });
    return true;
};

function isDownPossible(id) {
    newY = board[id].y + 1;
    if (newY > 8) {
        return false;
    };
    selfPieces.forEach(piece => {
        if (board[piece].y == newY && board[piece].x == board[id].x) {
            return false;
        };
    });
    opponentPieces.forEach(piece => {
        if (board[piece].y == newY && board[piece].x == board[id].x) { 
            if (newY == 8) {
                return false;
            };
            selfPieces.forEach(piece2 => {
                if (board[piece2].y == newY + 1 && board[piece2].x == board[id].x) {
                    return false;
                };
            });
            opponentPieces.forEach(piece2 => {
                if (board[piece2].y == newY + 1 && board[piece2].x == board[id].x) {
                    return false;
                };
            });
            return true;
        };
    });
    return true;
};

function isLeftPossible(id) {
    newX = board[id].x - 1;
    if (newX < 1) {
        return false;
    };
    selfPieces.forEach(piece => {
        if (board[piece].x == newX && board[piece].y == board[id].y) {
            return false;
        };
    });
    opponentPieces.forEach(piece => {
        if (board[piece].x == newX && board[piece].y == board[id].y) { 
            if (newX == 1) {
                return false;
            };
            selfPieces.forEach(piece2 => {
                if (board[piece2].x == newX - 1 && board[piece2].y == board[id].y) {
                    return false;
                };
            });
            opponentPieces.forEach(piece2 => {
                if (board[piece2].x == newX - 1 && board[piece2].y == board[id].y) {
                    return false;
                };
            });
            return true;
        };
    });
    return true;
};

function isRightPossible(id) {
    newX = board[id].x + 1;
    if (newX > 8) {
        return false;
    };
    selfPieces.forEach(piece => {
        if (board[piece].x == newX && board[piece].y == board[id].y) {
            return false;
        };
    });
    opponentPieces.forEach(piece => {
        if (board[piece].x == newX && board[piece].y == board[id].y) { 
            if (newY == 8) {
                return false;
            };
            selfPieces.forEach(piece2 => {
                if (board[piece2].x == newX + 1 && board[piece2].y == board[id].y) {
                    return false;
                };
            });
            opponentPieces.forEach(piece2 => {
                if (board[piece2].x == newX + 1 && board[piece2].y == board[id].y) {
                    return false;
                };
            });
            return true;
        };
    });
    return true;
};