var hostJoinRole = null;

function loadHostJoinContent() {
    ;
}

document.getElementById("hostimg").addEventListener('touchend', function() {
    if (checkInside("hostimg")) {
        openPage("hostjoinpage");
        hostJoinRole = "HOST";
        loadHostJoinContent();
    };
}, false);

document.getElementById("joinimg").addEventListener('touchend', function() {
    if (checkInside("joinimg")) {
        openPage("hostjoinpage");
        hostJoinRole = "JOIN";
        loadHostJoinContent();
    };
}, false);