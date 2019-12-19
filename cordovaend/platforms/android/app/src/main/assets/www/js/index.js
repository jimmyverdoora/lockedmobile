var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady.bind(app), false);
    },

    onDeviceReady: function() {
        app.activateButton('play');
        app.activateButton('settings');
    },

    activateButton: function(id) {
        var element = document.getElementById(id);
       
        element.setAttribute('style', 'display:block;');
    }
};

var pagemanager = {
    currentPage: "homepage",
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