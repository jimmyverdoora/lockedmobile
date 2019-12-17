document.getElementById("settingsimg").addEventListener('touchend', function() {
    if (checkInside("settingsimg")) {
        openPage("settingspage");
    };
}, false);

document.getElementById("playimg").addEventListener('touchend', function() {
    if (checkInside("playimg")) {
        openPage("playpage");
    };
}, false);