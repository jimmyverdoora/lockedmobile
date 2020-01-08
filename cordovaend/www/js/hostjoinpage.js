function submitNumbers() {
    var n = 0;
    for (i = 1; i < 7; i++) {
        n += Math.pow(10, 6-i)*document.getElementById("num" + i).value;
    }
    document.getElementById("joinheader").innerHTML = "<div class='loadingimage' style='background-position: center;'></div>";
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
            document.getElementById("hostheader").innerHTML = errorMsg;
            return;
        }
        var num = JSON.parse(this.responseText).number;
        document.getElementById("hostheader").innerHTML =
            "<p class='mergedbottom'>Tell your friend the following code:</p><p style='font-size: 20vw; border-width: 0 0 3px 0;'>" + num + "</p>";
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
            document.getElementById("hostheader").innerHTML = errorMsg;
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
        destroyBanner();
        fadeInto('game');
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
            document.getElementById("joinheader").innerHTML = errorMsg;
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
        destroyBanner();
        fadeInto('game');
        openPage("gamepage");
        resetJoinPage();
    }
    };
    xsub.open("POST", apiurl + "/join");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("number=" + n);
};

function resetHostPage() {
    document.getElementById("hostheader").innerHTML = "<div class='loadingimage' style='background-position: center;'></div>";
    document.getElementById("hostheader").setAttribute('style', 'display:none;');
};

function resetJoinPage() {
    document.getElementById("joinheader").innerHTML = "<p class='mergedbottom'>Insert your friend's lobby code:</p><div class='numbercontainer'><input placeholder='-' type='number' id='num1'><input placeholder='-' type='number' id='num2'><input placeholder='-' type='number' id='num3'><input placeholder='-' type='number' id='num4'><input placeholder='-' type='number' id='num5'><input placeholder='-' type='number' id='num6'></div>";
    for (i = 1; i < 6; i++) {
        let n = i+1;
        document.getElementById("num" + i).setAttribute('onkeyup', 'focusTo("num' + n + '");');
        document.getElementById("num" + i).setAttribute('ontouchstart', 'clearNumbersFrom(' + i + ')');
    };
    document.getElementById("num6").setAttribute('onkeyup', 'submitNumbers();');
    document.getElementById("joinheader").setAttribute('style', 'display:none;');
};

function modifyHeaders() {
    let color = "RED";
    let hex = "#910000";
    if (side == 1) {
        color = "BLUE";
        hex = "#003591";
    };
    document.getElementById("gameactiveheader").innerHTML = '<p>Your side: <span style="color: ' + hex + ';">' + color + "</span><br/>C'mon, move!</p><p id='timerTime'>30</p>"
    document.getElementById("gamewaitingheader").innerHTML = '<p>Your side: <span style="color: ' + hex + ';">' + color + "</span><br/>It's not your turn!</p><p id='waitTimer'>WAIT...</p>"
    var waitTimerState = 0;
    var waitTimer = setInterval(() => {
        if (waitTimerState > 3) {
            waitTimerState = 0;
        };
        document.getElementById("waitTimer").innerHTML = ".".repeat(waitTimerState) +  "WAIT" + ".".repeat(3 - waitTimerState);
        waitTimerState = waitTimerState + 1;
    }, 1000);
};

function clearNumbersFrom(n) {
    for (i = n; i < 7; i++) {
        document.getElementById("num" + i).value = "";
    };
};