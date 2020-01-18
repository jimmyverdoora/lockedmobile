function activatePlayer() {
    createPossibleMoves();
    canMove = true;
    document.getElementById("gamewaitingheader").setAttribute('style', 'display: none;');
    document.getElementById("gameactiveheader").setAttribute('style', 'display: block;');
    killWaitTimer();
    launchTimer();
};

function deactivatePlayer() {
    killTimer();
    launchWaitTimer();
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
        document.getElementById("p" + i).setAttribute('width', Math.round(screenW * 0.12) + 2);
    };
    for (i = 1; i < 5; i++) {
        document.getElementById("tp" + i).setAttribute('width', Math.round(screenW * 0.12) + 2);
    };
    document.getElementById("at").setAttribute('width', Math.round(screenW * 0.25 + 1));
    document.getElementById("atb").setAttribute('width', Math.round(screenW * 0.25 + 1));
    document.getElementById("ab").setAttribute('width', Math.round(screenW * 0.25 + 1));
    document.getElementById("abb").setAttribute('width', Math.round(screenW * 0.25 + 1));
    document.getElementById("al").setAttribute('width', Math.round(screenW * 0.25 + 1));
    document.getElementById("alb").setAttribute('width', Math.round(screenW * 0.25 + 1));
    document.getElementById("ar").setAttribute('width', Math.round(screenW * 0.4 + 2));
    document.getElementById("arb").setAttribute('width', Math.round(screenW * 0.4 + 2));
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
    var curX = parseInt(document.getElementById(id).style.left);
    var curY = parseInt(document.getElementById(id).style.top);
    if (!curX || !curY) {
        changeLocation(id, xp, yp);
        return;
    };
    var newX = Math.round((xp - 1) * screenW * 0.14 + screenW * 0.02) - 1;
    var newY = Math.round((yp - 1) * screenW * 0.14 + screenW * 0.02 + boardTop) - 1;
    var oldX = curX;
    var oldY = curY;
    var stepCounter = 1;
    var movement = setInterval(function() {
        if (curX == newX && curY == newY) {
            if (receivedTeleportMove) {
                performReceivedTeleportMove(receivedTeleportMove);
                receivedTeleportMove = null;
            };
            clearInterval(movement);
            return;
        };
        curX = Math.round(oldX + 0.1 * stepCounter * (newX - oldX));
        curY = Math.round(oldY + 0.1 * stepCounter * (newY - oldY));
        stepCounter = stepCounter + 1;
        document.getElementById(id).style.left = curX + "px";
        document.getElementById(id).style.top = curY + "px";
    }, 5);
};

function changeLocation(id, xp, yp) {
    yPixels = Math.round((yp - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).style.top = (boardTop + yPixels - 1).toString() + "px";
    xPixels = Math.round((xp - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).style.left = (xPixels - 1).toString() + "px";
};

function createWinScreen(player, hasSurrended) {
    let target = '<p>' + LMESSAGES["msglose"][userLocale] + '</p>';
    let quote = loseQuotes[Math.floor(Math.random() * loseQuotes.length)];
    if (player == side) {
        target = LMESSAGES["msgwin"][userLocale];
        if (hasSurrended) {
            target = '<p class="mergedbottom">' + target + "</p><p style='font-size: 7vw; border-top: 0;'>" + LMESSAGES["hassurr"]["it"] + "</p>"
        } else {
            target = '<p>' + target + '</p>';
        };
        quote = winQuotes[Math.floor(Math.random() * winQuotes.length)];
    };
    document.getElementById("gamewaitingheader").style.display = 'none';
    document.getElementById("gamewinheader").innerHTML = target + '<p style="font-size: 7vw;">' + quote + '</p>';
    document.getElementById("gamewinheader").style.display = 'block';
    killWaitTimer();
    var playAgainTimer = setInterval(() => {
        document.getElementById("playagain").setAttribute('ontouchstart', 'playAgain()');
        document.getElementById("playagain").style.display = 'block';
        clearInterval(playAgainTimer);
    }, 2500);
};

function performMoveLocally(piece, move) {
    let opponentPieceMoved = false;
    allPieces.forEach(element => {
        if (move == "t" && board[piece].x == board[element].x && board[piece].y == board[element].y + 1) {
            moveToPos(element, board[element].x, board[element].y - 1);
            opponentPieceMoved = true;
        } else if (move == "b" && board[piece].x == board[element].x && board[piece].y == board[element].y - 1) {
            moveToPos(element, board[element].x, board[element].y + 1);
            opponentPieceMoved = true;
        } else if (move == "l" && board[piece].x == board[element].x + 1 && board[piece].y == board[element].y) {
            moveToPos(element, board[element].x - 1, board[element].y);
            opponentPieceMoved = true;
        } else if (move == "r" && board[piece].x == board[element].x - 1 && board[piece].y == board[element].y) {
            moveToPos(element, board[element].x + 1, board[element].y);
            opponentPieceMoved = true;
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
    playSound("move");
    checkTeleport(piece, move, opponentPieceMoved);
};

function playAgain() {
    gameId = null;
    moveId = 1;
    side = 0;
    moveSent = false;

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
    fadeInto('menu');
    playSound('click');
    showInterstitialFunc();
    openPage("homepage");
    document.getElementById("playagain").style.display = 'none';
    document.getElementById("gamewinheader").style.display = 'none';
    document.getElementById("gamewaitingheader").style.display = 'block';
};

function launchTimer() {
    document.getElementById("timerTime").innerHTML = "30";
    timerTime = 29;
    moveTimer = setInterval(function() {
        let timeStamp = "" + timerTime;
        if (timerTime < 10) {
            timeStamp = "0" + timeStamp;
        };
        document.getElementById("timerTime").innerHTML = timeStamp;
        if (timerTime == 0) {
            clearArrows();
            canMove = false;
            setTimeout(() => {
                performRandomMove();
            }, 1000);
            killTimer();
            return;
        };
        timerTime = timerTime - 1;
    }, 1000);
};

function launchWaitTimer() {
    document.getElementById("waitTimer").innerHTML = "Wait";
    waitTimerState = 1;
    waitTimer = setInterval(() => {
        if (waitTimerState > 3) {
            waitTimerState = 0;
        };
        document.getElementById("waitTimer").innerHTML = "Wait" + ".".repeat(waitTimerState);
        waitTimerState = waitTimerState + 1;
    }, 1000);
};

function performRandomMove() {
    if (teleportActive) {
        performRandomTeleportMove();
    } else {
        chooseRandomMoveWithoutTeleport();
        deactivatePlayer();
        performMoveLocally(selected, currentMove);
        deliverMove();
        forbiddenMove = null;
    };
};

function killTimer() {
    clearInterval(moveTimer);
};

function killWaitTimer() {
    clearInterval(waitTimer);
};

function chooseRandomMoveWithoutTeleport() {
    let possibleRandomMoves = [];
    for (piece of selfPieces) {
        for (move of moves[piece]) {
            let add = true;
            if (move == "t") {
                for (i = 1; i < 5; i++) {
                    if (board[piece].x == tSpots["" + i][0] && 
                            (board[piece].y == tSpots["" + i][1] + 1 || board[piece].y == tSpots["" + i][1] + 2)) {
                        add = false;
                        break;
                    };
                };
            } else if (move == "b") {
                for (i = 1; i < 5; i++) {
                    if (board[piece].x == tSpots["" + i][0] && 
                            (board[piece].y == tSpots["" + i][1] - 1 || board[piece].y == tSpots["" + i][1] - 2)) {
                        add = false;
                        break;
                    };
                };
            } else if (move == "l") {
                for (i = 1; i < 5; i++) {
                    if (board[piece].y == tSpots["" + i][1] && 
                            (board[piece].x == tSpots["" + i][0] + 1 || board[piece].x == tSpots["" + i][0] + 2)) {
                        add = false;
                        break;
                    };
                };
            } else if (move == "r") {
                for (i = 1; i < 5; i++) {
                    if (board[piece].y == tSpots["" + i][1] && 
                            (board[piece].x == tSpots["" + i][0] - 1 || board[piece].x == tSpots["" + i][0] - 2)) {
                        add = false;
                        break;
                    };
                };
            };
            if (add) {
                possibleRandomMoves.push(piece + move);
            };
        };
    };
    let rand = possibleRandomMoves[Math.floor(Math.random() * possibleRandomMoves.length)];
    selected = rand.substring(0, 2);
    currentMove = rand.substring(2, 3);
};