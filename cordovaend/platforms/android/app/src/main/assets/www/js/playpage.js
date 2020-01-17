function loadHostContent() {
    document.getElementById("hostheader").setAttribute('style', 'display:block;')
    apiCreateNumber();
};

function loadJoinContent() {
    document.getElementById("joinmessage").innerHTML = LMESSAGES["msgjoin"][userLocale];
    document.getElementById("joinheader").setAttribute('style', 'display:block;')
};

document.getElementById("hostimg").addEventListener('touchend', function() {
    if (checkInside("hostimg")) {
        loadHostContent();
        openPage("hostjoinpage");
        showBannerFunc();
    };
}, false);

document.getElementById("joinimg").addEventListener('touchend', function() {
    if (checkInside("joinimg")) {
        loadJoinContent();
        openPage("hostjoinpage");
        showBannerFunc();
        setTimeout(function() {
            document.getElementById("num1").focus();
        }, 500);
    };
}, false);

document.getElementById("backimgp").addEventListener('touchend', function() {
    if (checkInside("backimgp")) {
        openPage("homepage");
    };
}, false);

document.getElementById("backimghj").addEventListener('touchend', function() {
    if (checkInside("backimghj")) {
        stillInTheHostPage = false;
        destroyBanner();
        openPage("playpage");
        resetHostPage();
        resetJoinPage();
    };
}, false);

document.getElementById("backimgc").addEventListener('touchend', function() {
    if (checkInside("backimgc")) {
        openPage("homepage");
    };
}, false);

document.getElementById("backimgs").addEventListener('touchend', function() {
    if (checkInside("backimgs")) {
        openPage("homepage");
    };
}, false);

function instr(page) {
    if (page == 4) {
        openPage("playpage");
        document.getElementById("instrp4").style.display = 'none';
        document.getElementById("instrp1").style.display = 'block';
    } else {
        document.getElementById("instrp" + page).style.display = 'none';
        document.getElementById("instrp" + (page+1)).style.display = 'block';
    };
    playSound("click");
};