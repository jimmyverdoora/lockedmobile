var MOVE_DICT = {"t": "U", "b": "D", "l": "L", "r": "R"};
var MOVE_DICT_R = {"U": "t", "D": "b", "L": "l", "R": "r"};

function deliverMove() {
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("gamewaitingheader").innerHTML = "ERROR"; // TODO
            return;
        };
        if (JSON.parse(this.responseText).win != 0) {
            createWinScreen(JSON.parse(this.responseText).win);
            return;
        };
        moveId += 1;
        askForNextMove();
    };
    };
    xsub.open("POST", apiurl + "/game");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let pieceNum = selected.substring(1, 2);
    xsub.send("requestType=PUT&gameId=" + gameId + "&moveId=" + moveId + "&move=" + pieceNum + MOVE_DICT[currentMove] + teleport);
    teleportActive = false;
    teleport = "";
    teleportedPiece = null;
    selected = null;
    currentMove = null;
    oX = 0;
    oY = 0;
};

function askForNextMove() {
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("gamewaitingheader").innerHTML = "ERROR"; // TODO
            return;
        };
        let parsedJson = JSON.parse(this.responseText);
        performMoveLocally("p" + parsedJson.move.substring(0, 1), MOVE_DICT_R[parsedJson.move.substring(1, 2)]);
        if (parsedJson.move.length == 3) {
            performReceivedTeleportMove(parsedJson.move);
        };
        if (parsedJson.win != 0) {
            createWinScreen(parsedJson.win);
            return;
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