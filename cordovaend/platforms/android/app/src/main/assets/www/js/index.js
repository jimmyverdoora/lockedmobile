var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady.bind(app), false);
    },

    onDeviceReady: function() {
        loadBoardSize();
        openPage("homepage");
    },
};

function loadBoardSize() {
    boardTop = Math.round($("#loadingcontainer").position().top + $("#loadingcontainer").height() - screenW * 1.14);
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

app.initialize();