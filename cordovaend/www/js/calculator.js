function createPossibleMoves() {
    selfPieces.forEach(element => {
        let avoid = "";
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
    let newY = board[id].y - 1;
    if (newY < 1) {
        return false;
    };
    for (piece of selfPieces) {
        if (board[piece].y == newY && board[piece].x == board[id].x) {
            return false;
        };
    };
    for (piece of opponentPieces) {
        if (board[piece].y == newY && board[piece].x == board[id].x) { 
            if (newY == 1) {
                return false;
            };
            for (piece2 of allPieces) {
                if (board[piece2].y == newY - 1 && board[piece2].x == board[id].x) {
                    return false;
                };
            };
            return true;
        };
    };
    return true;
};

function isDownPossible(id) {
    let newY = board[id].y + 1;
    if (newY > 8) {
        return false;
    };
    for (piece of selfPieces) {
        if (board[piece].y == newY && board[piece].x == board[id].x) {
            return false;
        };
    };
    for (piece of opponentPieces) {
        if (board[piece].y == newY && board[piece].x == board[id].x) { 
            if (newY == 8) {
                return false;
            };
            for (piece2 of allPieces) {
                if (board[piece2].y == newY + 1 && board[piece2].x == board[id].x) {
                    return false;
                };
            };
            return true;
        };
    };
    return true;
};

function isLeftPossible(id) {
    let newX = board[id].x - 1;
    if (newX < 1) {
        return false;
    };
    for (piece of selfPieces) {
        if (board[piece].x == newX && board[piece].y == board[id].y) {
            return false;
        };
    };
    for (piece of opponentPieces) {
        if (board[piece].x == newX && board[piece].y == board[id].y) { 
            if (newX == 1) {
                return false;
            };
            for (piece2 of allPieces) {
                if (board[piece2].x == newX - 1 && board[piece2].y == board[id].y) {
                    return false;
                };
            };
            return true;
        };
    };
    return true;
};

function isRightPossible(id) {
    let newX = board[id].x + 1;
    if (newX > 7) {
        return false;
    };
    for (piece of selfPieces) {
        if (board[piece].x == newX && board[piece].y == board[id].y) {
            return false;
        };
    };
    for (piece of opponentPieces) {
        if (board[piece].x == newX && board[piece].y == board[id].y) { 
            if (newX == 7) {
                return false;
            };
            for (piece2 of allPieces) {
                if (board[piece2].x == newX + 1 && board[piece2].y == board[id].y) {
                    return false;
                };
            };
            return true;
        };
    };
    return true;
};