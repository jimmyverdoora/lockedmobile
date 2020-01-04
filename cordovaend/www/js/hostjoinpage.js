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
            document.getElementById("hostheader").innerHTML = "ERROR: status: " + this.status + "Text:\n" + this.responseText; // TODO
            return;
        }
        var num = JSON.parse(this.responseText).number;
        document.getElementById("hostheader").innerHTML =
            "<p>Tell your friend the following code:</p><p style='font-size: 20vw'>" + num + "</p>";
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
            document.getElementById("hostheader").innerHTML = "ERROR: status: " + this.status + "Text:\n" + this.responseText; // TODO
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
        modifyHeaders();
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
            document.getElementById("joinheader").innerHTML = "ERROR: status: " + this.status + "Text:\n" + this.responseText; // TODO
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
        modifyHeaders()
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
    document.getElementById("joinheader").innerHTML = "<p>Insert your friend's lobby code:</p><div class='numbercontainer'><input placeholder='-' type='number' id='num1'><input placeholder='-' type='number' id='num2'><input placeholder='-' type='number' id='num3'><input placeholder='-' type='number' id='num4'><input placeholder='-' type='number' id='num5'><input placeholder='-' type='number' id='num6'></div>";
    for (i = 1; i < 6; i++) {
        let n = i+1;
        document.getElementById("num" + i).setAttribute('onkeyup', 'focusTo("num' + n + '");');
    };
    document.getElementById("num6").setAttribute('onkeyup', 'submitNumbers();');
    document.getElementById("joinheader").setAttribute('style', 'display:none;');
};

function modifyHeaders() {
    let color = "RED";
    if (side == 1) {
        color = "BLUE";
    };
    document.getElementById("gameactiveheader").innerHTML = '<h1>YOUR COLOR: ' + color + '</h1><h1>ITS YOUR TURN PLAY!!!</h1><h1 id="timerTime"></h1>'
    document.getElementById("gamewaitingheader").innerHTML = '<h1>YOUR COLOR: ' + color + '</h1><h1>ITS NOT YOUR TURN WAIT</h1>'
};