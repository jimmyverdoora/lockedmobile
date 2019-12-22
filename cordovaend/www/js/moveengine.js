function startTouch(id) {
    if (!canMove) {
        return;
    };
    let pos = $("#" + id).position();
    let aX = Math.round(pos.left - screenW * 0.14);
    let aY = Math.round(pos.top - screenW * 0.14);
    oX = Math.round(pos.left + screenW * 0.06);
    oY = Math.round(pos.top + screenW * 0.06);
    selected = id;
    let possibleMoves = moves[id];
    possibleMoves.forEach(element => {
        document.getElementById("a" + element).style.top = aY + "px";
        document.getElementById("a" + element).style.left = aX + "px";
        document.getElementById("a" + element + "b").style.top = aY + "px";
        document.getElementById("a" + element + "b").style.left = aX + "px";
        document.getElementById("a" + element).style.display = "block";
    });
};

function moveTouch(event, id) {
    if (!canMove) {
        return;
    };
    let cX = event.changedTouches[0].pageX;
    let cY = event.changedTouches[0].pageY;
    if (Math.abs(cX - oX) < screenW * 0.06 && Math.abs(cY - oY) < screenW * 0.06) {
        if (currentMove) {
            document.getElementById("a" + currentMove + "b").style.display = 'none';
            currentMove = null;
        }
        return;
    }
    let possibleMoves = moves[id];
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
    if (currentMove == newMove || !poss.includes(newMove)) {
        return;
    };
    if (currentMove) {
        document.getElementById("a" + currentMove + "b").style.display = 'none';
    };
    currentMove = newMove;
    document.getElementById("a" + currentMove + "b").style.display = 'none';
};

function endTouch() {
    if (currentMove) {
        deliverMove();
        forbiddenMove = null;
    };
    cancelTouch();
};

function cancelTouch() {
    document.getElementById("at").style.display = 'none';
    document.getElementById("atb").style.display = 'none';
    document.getElementById("ab").style.display = 'none';
    document.getElementById("abb").style.display = 'none';
    document.getElementById("al").style.display = 'none';
    document.getElementById("alb").style.display = 'none';
    document.getElementById("ar").style.display = 'none';
    document.getElementById("arb").style.display = 'none';
    selected = null;
    currentMove = null;
    oX = 0;
    oY = 0;
};