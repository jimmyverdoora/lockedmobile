function loadSettings() {
    if (volumeSounds > 0.5) {
        document.getElementById("settingssounds").innerHTML = "Sounds: <span style='color: #5beb34'>ON</span>"
    } else {
        document.getElementById("settingssounds").innerHTML = "Sounds: <span style='color: #eb3434'>OFF</span>"
    };
    if (volumeMusic > 0.5) {
        document.getElementById("settingsmusic").innerHTML = "Music: <span style='color: #5beb34'>ON</span>"
    } else {
        document.getElementById("settingsmusic").innerHTML = "Music: <span style='color: #eb3434'>OFF</span>"
    };
};