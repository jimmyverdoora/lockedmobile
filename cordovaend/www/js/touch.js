// ------- keeping track of the position ---------------------
var lastMove = null;
document.addEventListener('touchstart', function(event) {
    lastMove = event;
});
document.addEventListener('touchmove', function(event) {
    lastMove = event;
});
function checkInside(id) {
    var t = lastMove.changedTouches[0];
    var pos = $("#" + id).position();
    var w = $("#" + id).width();
    var h = $("#" + id).height();
    return (t.pageX > pos.left && t.pageX < pos.left + w && t.pageY > pos.top && t.pageY < pos.top + h);
}
// -----------------------------------------------------------
