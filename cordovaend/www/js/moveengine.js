function startTouch(id) {
    if (!canMove) {
        return;
    };
    var pos = $("#" + id).position();
    var aX = Math.round(pos.left - screenW * 0.14);
    var aY = Math.round(pos.top - screenW * 0.14);
    oX = Math.round(pos.left + screenW * 0.06);
    oY = Math.round(pos.top + screenW * 0.06);
    selected = id;
    var possibleMoves = moves[id];
    possibleMoves.forEach(element => {
        document.getElementById("a" + element).style.top = aY + "px";
        document.getElementById("a" + element).style.left = aX + "px";
        document.getElementById("a" + element).style.display = "block";
    });
};

function moveTouch(event, id) {
    if (!canMove) {
        return;
    };
    console.log(currentMove);
    var cX = event.changedTouches[0].pageX;
    var cY = event.changedTouches[0].pageY;
    if (Math.abs(cX - oX) < screenW * 0.06 || Math.abs(cY - oY) < screenW * 0.06) {
        if (currentMove) {
            document.getElementById("a" + currentMove + "b").setAttribute('style', 'display: none;');
            currentMove = null;
        }
        return;
    }
    var possibleMoves = moves[id];
    if (Math.abs(cX - oX) < Math.abs(cY - oY)) {
        if (cY > oY) {
            switchMove("b", possibleMoves);
        } else {
            switchMove("t", possibleMoves);
        };
    } else {
        if (cX > oX) {
            switchMove("r", possibleMoves);
        } else {
            switchMove("l", possibleMoves);
        };
    };
};

function switchMove(newMove, poss) {
    if (currentMove == newMove || !poss.include(newMove)) {
        return;
    };
    if (currentMove) {
        document.getElementById("a" + currentMove + "b").setAttribute('style', 'display: none;');
    };
    currentMove = newMove;
    document.getElementById("a" + currentMove + "b").setAttribute('style', 'display: block;')
};

function endTouch() {
    if (currentMove) {
        deliverMove();
    };
    cancelTouch();
};

function cancelTouch() {
    var possibleMoves = moves[selected];
    possibleMoves.forEach(element => {
        document.getElementById("a" + element).setAttribute('style', 'display: none;');
        document.getElementById("a" + element + "b").setAttribute('style', 'display: none;');
    });
    selected = null;
};