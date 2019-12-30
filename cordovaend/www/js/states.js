var gameId = null;
var moveId = 1;
var canMove = false;
var side = 0;
var screenW = window.screen.availWidth;
var boardTop = 0;
var allPieces = ["p1", "p2", "p3", "p4", "p5", "p6"];
var tSpots = {"1": [6, 2], "2": [2, 2], "3": [2, 7], "4": [6, 7]};


var board = {
    "p1": {x: 0, y: 0},
    "p2": {x: 0, y: 0},
    "p3": {x: 0, y: 0},
    "p4": {x: 0, y: 0},
    "p5": {x: 0, y: 0},
    "p6": {x: 0, y: 0},
};

// for the calculator
var selfPieces = [];
var opponentPieces = [];

// selected piece
var selected = null;

// center of the selected piece
var oX = 0;
var oY = 0;

// teleport states
var teleport = "";
var teleportedPiece = null;

// selected move
var currentMove = null;

var forbiddenMove = null;

// --- moves for each piece ---
var moves = {
    "p1": [],
    "p2": [],
    "p3": [],
    "p4": [],
    "p5": [],
    "p6": [],
};