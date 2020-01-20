var MOVE_DICT = {"t": "U", "b": "D", "l": "L", "r": "R"};
var MOVE_DICT_R = {"U": "t", "D": "b", "L": "l", "R": "r"};

function deliverMove() {
    if (moveSent) {
        return;
    };
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    // since 1.2.0 this receives already the opponent next moves
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("gamewaitingheader").innerHTML = errorMsg;
            return;
        };
        // if game is over, do nothing
        if (side == 0) {
            return;
        };
        let parsedJson = JSON.parse(this.responseText);
        if (parsedJson.move != "NM" && parsedJson.move != "SUR") {
            if (parsedJson.move.length == 3) {
                receivedTeleportMove = parsedJson.move;
            };
            performMoveLocally("p" + parsedJson.move.substring(0, 1), MOVE_DICT_R[parsedJson.move.substring(1, 2)]);
        };
        if (parsedJson.win != 0) {
            createWinScreen(parsedJson.win, parsedJson.move == "SUR");
            return;
        };
        if (parsedJson.forbiddenMove) {
            forbiddenMove = {piece : "p" + parsedJson.forbiddenMove.substring(0, 1), move: MOVE_DICT_R[parsedJson.forbiddenMove.substring(1, 2)]};
        };
        var actvTimer = setInterval(function() {
            activatePlayer();
            clearInterval(actvTimer);
        }, 1000);
        moveSent = false;
        moveId += 1;
    };
    };
    xsub.open("POST", apiurl + "/game");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let pieceNum = selected.substring(1, 2);
    xsub.send("requestType=PUT&gameId=" + gameId + "&moveId=" + moveId + "&move=" + pieceNum + MOVE_DICT[currentMove] + teleport);
    moveSent = true;
    teleportActive = false;
    teleport = "";
    teleportedPiece = null;
    selected = null;
    currentMove = null;
    oX = 0;
    oY = 0;
    moveId += 1;
    resetSurrend();
};

function askForNextMove() {
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("gamewaitingheader").innerHTML = errorMsg;
            return;
        };
        // if game is over, do nothing
        if (side == 0) {
            return;
        };
        let parsedJson = JSON.parse(this.responseText);
        performMoveLocally("p" + parsedJson.move.substring(0, 1), MOVE_DICT_R[parsedJson.move.substring(1, 2)]);
        if (parsedJson.move.length == 3) {
            receivedTeleportMove = parsedJson.move;
        };
        if (parsedJson.forbiddenMove) {
            forbiddenMove = {piece : "p" + parsedJson.forbiddenMove.substring(0, 1), move: MOVE_DICT_R[parsedJson.forbiddenMove.substring(1, 2)]};
        };
        activatePlayer();
        moveId += 1;
    };
    };
    xsub.open("POST", apiurl + "/game");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("requestType=ASK&gameId=" + gameId + "&moveId=" + moveId);
};

function sendSurrend() {
    let xsub = new XMLHttpRequest();
    let surrId = moveId;
    if (!canMove) {
        surrId += 1;
    } else {
        deactivatePlayer();
    };
    killWaitTimer();
    document.getElementById("gamewaitingheader").style.display = 'none';
    xsub.open("POST", apiurl + "/game");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("requestType=SUR&gameId=" + gameId + "&moveId=" + surrId);
    teleportActive = false;
    teleport = "";
    teleportedPiece = null;
    selected = null;
    currentMove = null;
    oX = 0;
    oY = 0;
    playAgain();
};