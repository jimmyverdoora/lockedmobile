function submitNumbers() {
    if (event.keyCode == 8) {
        document.getElementById('num6').value = "";
        document.getElementById('num5').value = "";
        document.getElementById('num5').focus();
        return;
    };
    let n = "";
    for (i = 1; i < 7; i++) {
        n = n + document.getElementById("num" + i).value.toString();
    };
    document.getElementById("joinheader").innerHTML = "<div class='loadingimage' style='background-position: center;'></div>";
    apiJoinNumber(parseInt(n));
};

function focusTo(id) {
    if (event.keyCode == 8) {
        if (id == 'num2') {
            return;
        };
        let numBefore = parseInt(id.substring(3, 4)) - 2;
        document.getElementById('num' + (numBefore+1)).value = "";
        document.getElementById('num' + numBefore).value = "";
        document.getElementById('num' + numBefore).focus();
        return;
    };
    document.getElementById(id).focus();
};

function apiCreateNumber() {
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("hostheader").innerHTML = errorMsg;
            return;
        }
        var num = JSON.parse(this.responseText).number;
        document.getElementById("hostheader").innerHTML =
            "<p class='mergedbottom'>"+ LMESSAGES["msghost"][userLocale] +"</p><p style='font-size: 20vw; border-width: 0 0 3px 0;'>" + num + "</p>";
        apiAskForJoin(num);
    }
    };
    xsub.open("GET", apiurl + "/host");
    xsub.send();
};

function apiAskForJoin(n) {
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("hostheader").innerHTML = errorMsg;
            stillInTheHostPage = false;
            return;
        };
        if (!stillInTheHostPage) {
            return;
        };
        gameId = JSON.parse(this.responseText).gameId;
        openPage("gamepage");
        loadBoardSize();
        if (JSON.parse(this.responseText).goFirst) {
            side = -1;
            selfPieces = ["p1", "p2", "p3"];
            opponentPieces = ["p4", "p5", "p6"];
            initBoard();
        } else {
            side = 1;
            opponentPieces = ["p1", "p2", "p3"];
            selfPieces = ["p4", "p5", "p6"];
            initBoard();
            askForNextMove();
        };
        modifyHeaders();
        if (side == 1) {
            launchWaitTimer();
        } else {
            activatePlayer();
        };
        destroyBanner();
        fadeInto('game');
        stillInTheHostPage = false;
        resetHostPage();
    }
    };
    xsub.open("POST", apiurl + "/host");
    xsub.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xsub.send("number=" + n);
    stillInTheHostPage = true;
};

function apiJoinNumber(n) {
    let xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("joinheader").innerHTML = errorMsg;
            return;
        };
        if (!JSON.parse(this.responseText).numberFound) {
            document.getElementById("joinheader").innerHTML = "<p class='errormsg'>Oops!<br/>"+ LMESSAGES["msgcantfind"][userLocale] +"</p>";
            return;
        };
        gameId = JSON.parse(this.responseText).gameId;
        openPage("gamepage");
        loadBoardSize();
        if (JSON.parse(this.responseText).goFirst) {
            side = -1;
            selfPieces = ["p1", "p2", "p3"];
            opponentPieces = ["p4", "p5", "p6"];
            initBoard();
        } else {
            side = 1;
            opponentPieces = ["p1", "p2", "p3"];
            selfPieces = ["p4", "p5", "p6"];
            initBoard();
            askForNextMove();
        };
        modifyHeaders();
        if (side == 1) {
            launchWaitTimer();
        } else {
            activatePlayer();
        };
        destroyBanner();
        fadeInto('game');
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
    document.getElementById("joinheader").innerHTML = "<p class='mergedbottom'>" + LMESSAGES["msgjoin"][userLocale] + "</p><div class='numbercontainer'><input placeholder='-' type='number' id='num1'><input placeholder='-' type='number' id='num2'><input placeholder='-' type='number' id='num3'><input placeholder='-' type='number' id='num4'><input placeholder='-' type='number' id='num5'><input placeholder='-' type='number' id='num6'></div>";
    for (i = 1; i < 6; i++) {
        let n = i+1;
        document.getElementById("num" + i).setAttribute('min', '0');
        document.getElementById("num" + i).setAttribute('max', '9');
        document.getElementById("num" + i).setAttribute('onkeyup', 'focusTo("num' + n + '");');
        document.getElementById("num" + i).setAttribute('ontouchstart', 'clearNumbersFrom(' + i + ')');
    };
    document.getElementById("num6").setAttribute('min', '0');
    document.getElementById("num6").setAttribute('max', '9');
    document.getElementById("num6").setAttribute('onkeyup', 'submitNumbers();');
    document.getElementById("joinheader").setAttribute('style', 'display:none;');
};

function modifyHeaders() {
    let color = LMESSAGES["red"][userLocale];
    let hex = "#910000";
    if (side == 1) {
        color = LMESSAGES["blue"][userLocale];
        hex = "#003591";
    };
    document.getElementById("gameactiveheader").innerHTML = '<p>'+ LMESSAGES["side"][userLocale] +': <span style="color: ' + hex + ';">' + color + "</span><br/>" + LMESSAGES["wait"][userLocale] + "</p><p id='timerTime'>30</p>";
    document.getElementById("gamewaitingheader").innerHTML = '<p>'+ LMESSAGES["side"][userLocale] +': <span style="color: ' + hex + ';">' + color + "</span><br/>" + LMESSAGES["wait"][userLocale] + "</p><p id='waitTimer'>Wait</p>";
};

function clearNumbersFrom(n) {
    for (i = n; i < 7; i++) {
        document.getElementById("num" + i).value = "";
    };
};