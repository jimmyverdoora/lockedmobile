function loadHostContent() {
    document.getElementById("hostheader").setAttribute('style', 'display:block;')
    apiCreateNumber();
};

function loadJoinContent() {
    document.getElementById("joinheader").setAttribute('style', 'display:block;')
};

document.getElementById("hostimg").addEventListener('touchend', function() {
    if (checkInside("hostimg")) {
        loadHostContent();
        openPage("hostjoinpage");
    };
}, false);

document.getElementById("joinimg").addEventListener('touchend', function() {
    if (checkInside("joinimg")) {
        loadJoinContent();
        openPage("hostjoinpage");
        document.getElementById("num1").focus();
    };
}, false);