function loadSettings() {
    if (volumeSounds > 0.5) {
        document.getElementById("settingssounds").innerHTML = SMESSAGES["settingssounds"][userLocale] + ": <span style='color: #5beb34'>ON</span>";
    } else {
        document.getElementById("settingssounds").innerHTML = SMESSAGES["settingssounds"][userLocale] + ": <span style='color: #eb3434'>OFF</span>";
    };
    if (volumeMusic > 0.5) {
        document.getElementById("settingsmusic").innerHTML = SMESSAGES["settingsmusic"][userLocale] + ": <span style='color: #5beb34'>ON</span>"
    } else {
        document.getElementById("settingsmusic").innerHTML = SMESSAGES["settingsmusic"][userLocale] + ": <span style='color: #eb3434'>OFF</span>"
    };
};