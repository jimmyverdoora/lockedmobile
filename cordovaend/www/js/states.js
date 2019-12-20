var gameId = null;
var canMove = false;
var side = 0;
var screenW = window.screen.availWidth;
var boardTop = Math.round(window.screen.availHeight * 0.25);

var board = {
    "p1": {x = 0, y = 0},
    "p2": {x = 0, y = 0},
    "p3": {x = 0, y = 0},
    "p4": {x = 0, y = 0},
    "p5": {x = 0, y = 0},
    "p6": {x = 0, y = 0},
};

// selected piece
var selected = null;

// center of the selected piece
var oX = 0;
var oy = 0;

// selected move
var currentMove = null;

// --- moves for each piece ---
var m1 = [];
var m2 = [];
var m3 = [];
var m4 = [];
var m5 = [];
var m6 = [];