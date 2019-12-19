function activatePlayer() {
    canMove = true;
    document.getElementById("gamewaitingheader").setAttribute('style', 'display: none;');
    document.getElementById("gameactiveheader").setAttribute('style', 'display: block;');
};

function deactivatePlayer() {
    canMove = false;
    document.getElementById("gameactiveheader").setAttribute('style', 'display: none;');
    document.getElementById("gamewaitingheader").setAttribute('style', 'display: block;');
};

function initBoard() {
    for (i = 1; i < 7; i++) {
        document.getElementById("p" + i).setAttribute('width', Math.round(screenW * 0.12));
    };
    moveToPos(1, 3, 5);
    moveToPos(2, 4, 3);
    moveToPos(3, 5, 5);
    moveToPos(4, 3, 4);
    moveToPos(5, 4, 6);
    moveToPos(6, 5, 4);
}

function moveToPos(id, x, y) {
    yPixels = Math.round((y - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById("p" + id).setAttribute('top', boardTop.toString() + yPixels.toString() + "px");
    xPixels = Math.round((x - 1) * screenW * 0.14 + screenW * 0.02);
    document.getElementById("p" + id).setAttribute('left', xPixels.toString() + "px");
};