document.getElementById("creditsimg").addEventListener('touchend', function() {
    if (checkInside("creditsimg")) {
        openPage("creditspage");
    };
}, false);

document.getElementById("playimg").addEventListener('touchend', function() {
    if (checkInside("playimg")) {
        if (true) {
        //if (!storage.getItem("alreadyPlayed")) {
            showInstructions();
            storage.setItem("alreadyPlayed", "true");
        } else { 
            openPage("playpage");
        };
    };
}, false);

function showInstructions() {
    openPage("instructionspage");
};