var clickSoundUrl = null;
var moveSound = null;
var menuMusic = null;
var gameMusic = null;

// for loop
var currentMusic = "menu";
var menuLoop = function(status) {
    if (status === Media.MEDIA_STOPPED && currentMusic == "menu" && volumeMusic > 0.5) { 
        menuMusic.play();
    }; 
};
var gameLoop = function(status) {
    if (status === Media.MEDIA_STOPPED && currentMusic == "game" && volumeMusic > 0.5) { 
        gameMusic.play();
    }; 
};

function playSound(sound) {
    if (volumeSounds < 0.5) {
        return;
    };
    if (sound == 'click') {
        let clickSound = new Media(clickSoundUrl, null, null);
        clickSound.setVolume(1.0);
        clickSound.play();
    } else if (sound == 'move') {
        moveSound.play();
    };
};

function loadSounds() {
    // click has to be recreated since it can be overplayed
    clickSoundUrl = getMediaURL("sounds/click.wav");
    let url2 = getMediaURL("sounds/move.wav");
    let url3 = getMediaURL("sounds/menu.mp3");
    let url4 = getMediaURL("sounds/game.mp3");
    moveSound = new Media(url2, null, null);
    menuMusic = new Media(url3, null, null, menuLoop);
    gameMusic = new Media(url4, null, null, gameLoop);
    if (storage.getItem("soundVol")) {
        volumeSounds = parseInt(storage.getItem("soundVol"));
    };
    if (storage.getItem("musicVol")) {
        volumeMusic = parseInt(storage.getItem("musicVol"));
    };
    moveSound.setVolume(1.0);
    menuMusic.setVolume(1.0);
    gameMusic.setVolume(1.0);
    if (volumeMusic > 0.5) {
        menuMusic.play();
    };
};

function changeSoundVol() {
    if (volumeSounds > 0.5) {
        volumeSounds = 0.0;
        storage.setItem("soundVol", "0");
    } else {
        volumeSounds = 1.0;
        storage.setItem("soundVol", "1");
    };
    loadSettings();
    playSound("click");
};

function changeMusicVol() {
    if (volumeMusic > 0.5) {
        volumeMusic = 0.0;
        storage.setItem("musicVol", "0");
        menuMusic.stop();
    } else {
        volumeMusic = 1.0;
        storage.setItem("musicVol", "1");
        menuMusic.play();
    };
    loadSettings();
    playSound("click");
};

function fadeInto(what) {
    if (volumeMusic < 0.5) {
        return;
    };
    mswitch = false;
    var mchange = setInterval(() => {
        if (volumeMusic > 0.95 && mswitch) {
            clearInterval(mchange);
            return;
        };
        if (volumeMusic > 0.05) {
            if (mswitch) {
                volumeMusic = volumeMusic + 0.1;
            } else {
                volumeMusic = volumeMusic - 0.1;
            };
            menuMusic.setVolume(volumeMusic);
            gameMusic.setVolume(volumeMusic);
        } else {
            if (what == 'game') {
                currentMusic = "game";
                menuMusic.stop();
                gameMusic.play();
            } else if (what == 'menu') {
                currentMusic = "menu";
                gameMusic.stop();
                menuMusic.play();
            };
            volumeMusic = volumeMusic + 0.1;
            mswitch = true;
        };
    }, 100);
};

function getMediaURL(s) {
    if (device.platform.toLowerCase() === "android") {
        return "/android_asset/www/" + s;
    };
    return s;
};