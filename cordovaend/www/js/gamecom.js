var MOVE_DICT = {"t": "U", "b": "D", "l": "L", "r": "R"};
var MOVE_DICT_R = {"U": "t", "D": "b", "L": "l", "R": "r"};

function deliverMove() {
    deactivatePlayer();
    performMoveLocally(selected, currentMove);
    var xsub = new XMLHttpRequest();
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
    var pieceNum = selected.subString(1, 2);
    xsub.send("requestType=PUT&gameId=" + gameId + "&moveId=" + moveId + "&move=" + pieceNum + MOVE_DICT[currentMove]);
    selected = null;
    currentMove = null;
};

function askForNextMove() {
    var xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("gamewaitingheader").innerHTML = "ERROR"; // TODO
            return;
        };
        var parsedJson = JSON.parse(this.responseText);
        if (parsedJson.win != 0) {
            createWinScreen(parsedJson.win);
            return;
        };
        performMoveLocally("p" + parsedJson.move.subString(0, 1), MOVE_DICT_R[parsedJson.move.subString(1, 2)]);
        if (parsedJson.forbiddenMove) {
            forbiddenMove = {piece : "p" + parsedJson.forbiddenMove.subString(0, 1), move: MOVE_DICT_R[parsedJson.forbiddenMove.subString(1, 2)]};
        };
        activatePlayer();
        moveId += 1;
    };
    };
    xsub.open("POST", apiurl + "/game");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("requestType=ASK&gameId=" + gameId + "&moveId=" + moveId);
};