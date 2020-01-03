document.getElementById("creditsimg").addEventListener('touchend', function() {
    if (checkInside("creditsimg")) {
        openPage("creditspage");
    };
}, false);

document.getElementById("playimg").addEventListener('touchend', function() {
    if (checkInside("playimg")) {
        openPage("playpage");
    };
}, false);