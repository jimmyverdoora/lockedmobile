var clickSound = null;
var moveSound = null;
var menuMusic = null;
var gameMusic = null;

function playSound(sound) {
    if (sound == 'click') {
        clickSound.play();
    } else if (sound == 'move') {
        moveSound.play();
    };
};

function loadSounds() {
    let url1 = getMediaURL("sounds/click.wav");
    let url2 = getMediaURL("sounds/move.wav");
    let url3 = getMediaURL("sounds/menu.mp3");
    let url4 = getMediaURL("sounds/game.mp3");
    clickSound = new Media(url1, null, mediaError);
    moveSound = new Media(url2, null, mediaError);
    menuMusic = new Media(url3, null, mediaError);
    gameMusic = new Media(url4, null, mediaError);
    if (storage.getItem("soundVol")) {
        volumeSounds = parseFloat(storage.getItem("soundVol"));
    };
    if (storage.getItem("musicVol")) {
        volumeMusic = parseFloat(storage.getItem("musicVol"));
    };
    clickSound.setVolume(volumeSounds);
    moveSound.setVolume(volumeSounds);
    menuMusic.setVolume(volumeMusic);
    gameMusic.setVolume(volumeMusic);
    menuMusic.play();
};

function changeSoundVol() {
    if (volumeSounds > 0.5) {
        volumeSounds = 0.0;
        storage.setItem("soundVol", "0.0");
    } else {
        volumeSounds = 1.0;
        storage.setItem("soundVol", "1.0");
    };
};

function changeMusicVol() {
    if (volumeMusic > 0.5) {
        volumeMusic = 0.0;
        storage.setItem("musicVol", "0.0");
    } else {
        volumeMusic = 1.0;
        storage.setItem("musicVol", "1.0");
    };
};

function fadeInto(what) {
    if (volumeMusic < 0.5) {
        return;
    };
    mswitch = false;
    var mchange = setInterval(() => {
        if (volumeMusic > 0.95 && mswitch) {
            clearInterval(mchange);
        };
        if (volumeMusic > 0.05) {
            if (mswitch) {
                volumeMusic = volumeMusic + 0.1;
            } else {
                volumeMusic = volumeMusic - 0.1;
            };
        } else {
            if (what == 'game') {
                menuMusic.stop();
                gameMusic.play();
            } else if (what == 'menu') {
                gameMusic.stop();
                menuMusic.play();
            };
            volumeMusic = volumeMusic + 0.1;
            mswitch = true;
        };
    }, 50);
};

function getMediaURL(s) {
    if (device.platform.toLowerCase() === "android") {
        return "/android_asset/www/" + s;
    };
    return s;
}

function mediaError(e) {};