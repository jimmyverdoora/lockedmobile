function activatePlayer() {
    createPossibleMoves();
    canMove = true;
    document.getElementById("gamewaitingheader").setAttribute('style', 'display: none;');
    document.getElementById("gameactiveheader").setAttribute('style', 'display: block;');
};

function deactivatePlayer() {
    canMove = false;
    cleanMoves();
    document.getElementById("gameactiveheader").setAttribute('style', 'display: none;');
    document.getElementById("gamewaitingheader").setAttribute('style', 'display: block;');
};

function cleanMoves() {
    selfPieces.forEach(element => {
        moves[element] = [];
    });
};

function initBoard() {
    for (i = 1; i < 7; i++) {
        document.getElementById("p" + i).setAttribute('width', Math.round(screenW * 0.12));
    };
    document.getElementById("at").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("atb").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("ab").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("abb").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("al").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("alb").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("ar").setAttribute('width', Math.round(screenW * 0.4));
    document.getElementById("arb").setAttribute('width', Math.round(screenW * 0.4));
    moveToPos("p1", 3, 5);
    moveToPos("p2", 4, 3);
    moveToPos("p3", 5, 5);
    moveToPos("p4", 3, 4);
    moveToPos("p5", 4, 6);
    moveToPos("p6", 5, 4);
    var j = Math.round((side + 1) * 3 / 2);
    for (i = 1; i < 4; i++) {
        var ij = i + j;
        document.getElementById("p" + ij).setAttribute('ontouchstart', 'startTouch("p' + ij + '")');
        document.getElementById("p" + ij).setAttribute('ontouchmove', 'moveTouch(event, "p' + ij + '")');
        document.getElementById("p" + ij).setAttribute('ontouchend', 'endTouch()');
        document.getElementById("p" + ij).setAttribute('ontouchcancel', 'cancelTouch()');
    };
};

function moveToPos(id, x, y) {
    board[id].x = x;
    board[id].y = y;
    yPixels = Math.round((y - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).style.top = (boardTop + yPixels).toString() + "px";
    xPixels = Math.round((x - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).style.left = xPixels.toString() + "px";
};

function createWinScreen(player) {
    // TODO
    var target = "YOU LOST BRO";
    if (player == side) {
        target = "YOU WIN BRO!";
    };
    document.getElementById("gamewaitingheader").innerHTML = target;
};

function performMoveLocally(piece, move) {
    opponentPieces.forEach(element => {
        if (move == "t" && board[piece].x == board[element].x && board[piece].y == board[element].y - 1) {
            moveToPos(element, board[element].x, board[element].y - 1);
        } else if (move == "b" && board[piece].x == board[element].x && board[piece].y == board[element].y + 1) {
            moveToPos(element, board[element].x, board[element].y + 1);
        } else if (move == "l" && board[piece].x == board[element].x - 1 && board[piece].y == board[element].y) {
            moveToPos(element, board[element].x - 1, board[element].y);
        } else if (move == "r" && board[piece].x == board[element].x + 1 && board[piece].y == board[element].y) {
            moveToPos(element, board[element].x + 1, board[element].y);
        };
    });
    if (move == "t") {
        moveToPos(piece, board[piece].x, board[piece].y - 1);
    } else if (move == "b") {
        moveToPos(piece, board[piece].x, board[piece].y + 1);
    } else if (move == "l") {
        moveToPos(piece, board[piece].x - 1, board[piece].y);
    } else if (move == "r") {
        moveToPos(piece, board[piece].x + 1, board[piece].y);
    };
};