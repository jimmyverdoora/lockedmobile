function activatePlayer() {
    canMove = true;
    createPossibleMoves();
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
    if (side == -1) {
        m1 = [];
        m2 = [];
        m3 = [];
    } else {
        m4 = [];
        m5 = [];
        m6 = [];
    };
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
    moveToPos("P5", 4, 6);
    moveToPos("p6", 5, 4);
    var j = Math.round((side + 1) * 3 / 2);
    for (i = 1; i < 4; i++) {
        var ij = i + j;
        document.getElementById("p" + ij).setAttribute('ontouchstart', 'startTouch("p' + ij + '", m' + ij + ')');
        document.getElementById("p" + ij).setAttribute('ontouchmove', 'moveTouch(event, m' + ij + ')');
        document.getElementById("p" + ij).setAttribute('ontouchend', 'endTouch()');
        document.getElementById("p" + ij).setAttribute('ontouchcancel', 'cancelTouch()');
    };
};

function moveToPos(id, x, y) {
    board[id].x = x;
    board[id].y = y;
    yPixels = Math.round((y - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).setAttribute('top', boardTop.toString() + yPixels.toString() + "px");
    xPixels = Math.round((x - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById(id).setAttribute('left', xPixels.toString() + "px");
};