function submitNumbers() {
    var n = 0;
    for (i = 1; i < 7; i++) {
        n += Math.pow(10, 6-i)*document.getElementById("num" + i).value;
    }
    document.getElementById("joinheader").innerHTML = "<img class='textimage' src='img/loading.png'>";
    apiJoinNumber(n);
};

function focusTo(id) {
    document.getElementById(id).focus();
};

function apiCreateNumber() {
    var xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("hostheader").innerHTML = "ERROR"; // TODO
            return;
        }
        var num = JSON.parse(this.responseText).number;
        document.getElementById("hostheader").innerHTML =
            "<p>Tell your friend the following code:</p><p>.   " + num + "</p>";
        apiAskForJoin(num);
    }
    };
    xsub.open("GET", apiurl + "/host");
    xsub.send();
};

function apiAskForJoin(n) {
    var xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("hostheader").innerHTML = "ERROR"; // TODO
            return;
        }
        gameId = JSON.parse(this.responseText).gameId;
        if (JSON.parse(this.responseText).goFirst) {
            side = -1;
            selfPieces = ["p1", "p2", "p3"];
            opponentPieces = ["p4", "p5", "p6"];
            initBoard();
            activatePlayer();
        } else {
            side = 1;
            opponentPieces = ["p1", "p2", "p3"];
            selfPieces = ["p4", "p5", "p6"];
            initBoard();
            askForNextMove();
        }
        openPage("gamepage");
        resetHostPage();
    }
    };
    xsub.open("POST", apiurl + "/host");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("number=" + n);
};

function apiJoinNumber(n) {
    var xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("joinheader").innerHTML = "ERROR"; // TODO
            return;
        }
        gameId = JSON.parse(this.responseText).gameId;
        initBoard();
        if (JSON.parse(this.responseText).goFirst) {
            side = -1;
            selfPieces = ["p1", "p2", "p3"];
            opponentPieces = ["p4", "p5", "p6"];
            initBoard();
            activatePlayer();
        } else {
            side = 1;
            opponentPieces = ["p1", "p2", "p3"];
            selfPieces = ["p4", "p5", "p6"];
            initBoard();
            askForNextMove();
        }
        openPage("gamepage");
        resetJoinPage();
    }
    };
    xsub.open("POST", apiurl + "/join");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("number=" + n);
};

function resetHostPage() {
    document.getElementById("hostheader").innerHTML = "<img class='textimage' src='img/loading.png'>";
    document.getElementById("hostheader").setAttribute('style', 'display:none;');
};

function resetJoinPage() {
    document.getElementById("joinheader").innerHTML = '<input type="number" id="num1"><input type="number" id="num2"><input type="number" id="num3"><input type="number" id="num4"><input type="number" id="num5"><input type="number" id="num6"></input>';
    for (i = 1; i < 6; i++) {
        var n = i+1;
        document.getElementById("num" + i).setAttribute('onkeyup', 'focusTo("num' + n + '");');
        document.getElementById("num6").setAttribute('onkeyup', 'submitNumbers();');
    }
};