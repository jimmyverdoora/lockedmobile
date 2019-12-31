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
    for (i = 1; i < 5; i++) {
        document.getElementById("tp" + i).setAttribute('width', Math.round(screenW * 0.12));
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
    changeLocation("tp1", 6, 2);
    changeLocation("tp2", 2, 2);
    changeLocation("tp3", 2, 7);
    changeLocation("tp4", 6, 7);
    let j = Math.round((side + 1) * 1.5);
    for (i = 1; i < 4; i++) {
        let ij = i + j;
        document.getElementById("p" + ij).setAttribute('ontouchstart', 'startTouch("p' + ij + '")');
        document.getElementById("p" + ij).setAttribute('ontouchmove', 'moveTouch(event, "p' + ij + '")');
        document.getElementById("p" + ij).setAttribute('ontouchend', 'endTouch()');
        document.getElementById("p" + ij).setAttribute('ontouchcancel', 'cancelTouch()');
    };
};

function moveToPos(id, xp, yp) {
    board[id].x = xp;
    board[id].y = yp;
    changeLocation(id, xp, yp);
};

function changeLocation(id, xp, yp) {
    yPixels = Math.round((yp - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).style.top = (boardTop + yPixels).toString() + "px";
    xPixels = Math.round((xp - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).style.left = xPixels.toString() + "px";
};

function createWinScreen(player) {
    // TODO
    let target = "YOU LOST BRO";
    if (player == side) {
        target = "YOU WIN BRO!";
    };
    document.getElementById("gamewaitingheader").style.display = 'none';
    document.getElementById("gamewinheader").innerHTML = '<h1>' + target + '</h1><h1 ontouchstart="playAgain()">PLAY AGAIN</h1>';
    document.getElementById("gamewinheader").style.display = 'block';
};

function performMoveLocally(piece, move) {
    allPieces.forEach(element => {
        if (move == "t" && board[piece].x == board[element].x && board[piece].y == board[element].y + 1) {
            moveToPos(element, board[element].x, board[element].y - 1);
        } else if (move == "b" && board[piece].x == board[element].x && board[piece].y == board[element].y - 1) {
            moveToPos(element, board[element].x, board[element].y + 1);
        } else if (move == "l" && board[piece].x == board[element].x + 1 && board[piece].y == board[element].y) {
            moveToPos(element, board[element].x - 1, board[element].y);
        } else if (move == "r" && board[piece].x == board[element].x - 1 && board[piece].y == board[element].y) {
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
    checkTeleport(piece, move);
};

function playAgain() {
    gameId = null;
    moveId = 1;
    side = 0;

    board = {
        "p1": {x: 0, y: 0},
        "p2": {x: 0, y: 0},
        "p3": {x: 0, y: 0},
        "p4": {x: 0, y: 0},
        "p5": {x: 0, y: 0},
        "p6": {x: 0, y: 0},
    };

    selfPieces = [];
    opponentPieces = [];
    openPage("homepage");
    document.getElementById("gamewinheader").style.display = 'none';
    document.getElementById("gamewaitingheader").style.display = 'block';
};