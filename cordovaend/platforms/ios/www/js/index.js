var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady.bind(app), false);
    },

    onDeviceReady: function() {
        screen.orientation.lock('portrait');
        loadBoardSize();
        loadExitEvents();
        storage = window.localStorage;
        loadSounds();
        openPageDependingOnVersion();
        loadAds();
    },
};

function loadBoardSize() {
    boardTop = Math.round($("#loadingcontainer").position().top + $("#loadingcontainer").height() - screenW * 1.14);
};

function loadExitEvents() {
    document.addEventListener('resume', ( ) => {
        if (volumeMusic > 0.5) {
            if (currentMusic == "game") {
                gameMusic.play();
            } else if (currentMusic == "menu") {
                menuMusic.play();
            };
        };
    });
    document.addEventListener('pause', ( ) => {
        if (volumeMusic > 0.5) {
            if (currentMusic == "game") {
                gameMusic.pause();
            } else if (currentMusic == "menu") {
                menuMusic.pause();
            };
        };
    });
    window.addEventListener('beforeunload', function(event) {
        if (volumeMusic > 0.5) {
            if (currentMusic == "game") {
                gameMusic.stop();
            } else if (currentMusic == "menu") {
                menuMusic.stop();
            };
        };
    });
};

var pagemanager = {
    currentPage: "loadingpage",
    changePage: function(id) {
        document.getElementById(pagemanager.currentPage).setAttribute('style', 'display:none;');
        document.getElementById(id).setAttribute('style', 'display:block;');
        pagemanager.currentPage = id;
    }
}

function openPage(id) {
    pagemanager.changePage(id);
}

function openPageDependingOnVersion() {
    var xsub = new XMLHttpRequest();
    xsub.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status != 200 || JSON.parse(this.responseText).outcome == "KO") {
            document.getElementById("versionheader").innerHTML = errorMsg;
            return;
        }
        let serverVersion = JSON.parse(this.responseText).version;
        if (serverVersion == currentVersion) {
            openPage("homepage");
        } else {
            openPage("versionpage");
        };
    }
    };
    xsub.open("GET", apiurl + "/version");
    xsub.send();
};

app.initialize();