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
            "<p class='mergedbottom'>"+ LMESSAGES["msghost"][userLocale] +
            "</p><p id='hostnb' style='font-size: 20vw; border-width: 0 0 0 0; margin-bottom: 0;'>" + num + "</p>" +
            "<p style='font-size: 5vw; border-width: 0 0 3px 0;'>" + LMESSAGES["msghost2"][userLocale] + "</p>";
        var tmpNumIntv = setInterval(() => {
            document.getElementById("hostnb").setAttribute('ontouchstart', 'copyToClip(' + num + ');');
            clearInterval(tmpNumIntv);
        }, 250);
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
            resetSurrend();
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
            resetSurrend();
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
    document.getElementById("joinheader").innerHTML = "<p class='mergedbottom' id='joinmessage'>" + LMESSAGES["msgjoin"][userLocale] + "</p><div class='numbercontainer'><input placeholder='-' type='number' id='num1'><input placeholder='-' type='number' id='num2'><input placeholder='-' type='number' id='num3'><input placeholder='-' type='number' id='num4'><input placeholder='-' type='number' id='num5'><input placeholder='-' type='number' id='num6'></div>";
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
    document.getElementById("gameactiveheader").innerHTML = '<p style="font-size: 8vw;">'+
        LMESSAGES["side"][userLocale] +': <span style="color: ' + hex + ';">' + color + "</span><br/>" +
        LMESSAGES["move"][userLocale] + " <span id='timerTime'>30</span></p>" + 
        "<p class='instrproceedp' id='surrendactive'></p>";
    document.getElementById("gamewaitingheader").innerHTML = '<p style="font-size: 8vw;">'+
        LMESSAGES["side"][userLocale] +': <span style="color: ' + hex + ';">' + color + "</span><br/>" +
        LMESSAGES["wait"][userLocale] + " <span id='waitTimer'>Wait</span></p>" +
        "<p class='instrproceedp' id='surrendinactive'></p>";
};

function clearNumbersFrom(n) {
    for (i = n; i < 7; i++) {
        document.getElementById("num" + i).value = "";
    };
};

function copyToClip(number) {
    cordova.plugins.clipboard.copy("" + number);
    $("#hostnb").addClass("copied");
    var tmpCopiedInt = setInterval(() => {
        $("#hostnb").removeClass("copied");
        clearInterval(tmpCopiedInt);
    }, 500);
};

function surrend(active) {
    document.getElementById("surrend" + active).innerHTML = "<span>" + LMESSAGES["sure"][userLocale] +
        "</span><br/><span class='instrproceed' ontouchstart='sendSurrend()'>" + LMESSAGES["y"][userLocale] +
        "</span> <span class='instrproceed' ontouchstart='clickResetSurrend()'>" + LMESSAGES["n"][userLocale] +
        "</span>";
    playSound('click');
};

function clickResetSurrend() {
    playSound('click');
    resetSurrend();
};

function resetSurrend() {
    document.getElementById("surrendactive").innerHTML = "<span class='instrproceed' ontouchstart='surrend(" +
        '"active"' + ")'>" + LMESSAGES["surrender"][userLocale] + "</span>";
    document.getElementById("surrendinactive").innerHTML = "<span class='instrproceed' ontouchstart='surrend(" +
        '"inactive"' + ")'>" + LMESSAGES["surrender"][userLocale] + "</span>";
};