function performTeleport() {
    let busySpots = [];
    for (piece of allPieces) {
        for (i = 1; i < 5; i++) {
            if (tSpots["" + i][0] == board[piece].x && tSpots["" + i][1] == board[piece].y) {
                busySpots.push(i);
                break;
            };
        };
    };
    if (busySpots.length == 4) {
        // case where the piece cannot go anywhere
        return;
    };
    for (i = 1; i < 5; i++) {
        if (busySpots.includes(i)) {
            continue;
        };
        document.getElementById("tp" + i).style.display = 'block';
        document.getElementById("tp" + i).setAttribute('ontouchstart', 'teleportPiece(' + teleportedPiece + ', ' + i +')');
    };
};

function teleportPiece(id, tpId) {
    for (i = 1; i < 5; i++) {
        document.getElementById("tp" + tpId).removeAttribute('ontouchstart');
        document.getElementById("tp" + tpId).style.display = 'none';
    };
    teleport = tpId;
    board[id].x = tSpots["" + tpId][0];
    board[id].y = tSpots["" + tpId][1];
    teleportPieceLocally(id, tpId);
    deliverMove();
};

function performReceivedTeleportMove(move) {
    let movedPiece = "p" + move.substring(0, 1);
    for (i = 1; i < 5; i++) {
        if (board[movedPiece].x == tSpots["" + i][0] && board[movedPiece].y == tSpots["" + i][1]) {
            teleportPieceLocally(movedPiece, move.substring(2, 3));
            return;
        };
    };
    let tmpDirect = MOVE_DICT_R[move.substring(1, 2)];
    for (piece of selfPieces) {
        if (tmpDirect == "l" && board[piece].y == board[movedPiece].y && board[piece].x == board[movedPiece] - 1) {
            teleportPieceLocally(piece, move.substring(2, 3));
            return;
        };
        if (tmpDirect == "r" && board[piece].y == board[movedPiece].y && board[piece].x == board[movedPiece] + 1) {
            teleportPieceLocally(piece, move.substring(2, 3));
            return;
        };
        if (tmpDirect == "t" && board[piece].y == board[movedPiece].y - 1 && board[piece].x == board[movedPiece]) {
            teleportPieceLocally(piece, move.substring(2, 3));
            return;
        };
        if (tmpDirect == "b" && board[piece].y == board[movedPiece].y + 1 && board[piece].x == board[movedPiece]) {
            teleportPieceLocally(piece, move.substring(2, 3));
            return;
        };
    };
};

function teleportPieceLocally(id, tpId) {
    board[id].x = tSpots["" + tpId][0];
    board[id].y = tSpots["" + tpId][1];
    changeLocation(id, board[id].x, board[id].y);
};