// ------- keeping track of the position ---------------------
var lastMove = null;
document.addEventListener('touchstart', function(event) {
    lastMove = event;
});
document.addEventListener('touchmove', function(event) {
    lastMove = event;
});
function checkInside(id) {
    let t = lastMove.changedTouches[0];
    let pos = $("#" + id).position();
    let w = $("#" + id).width();
    let h = $("#" + id).height();
    return (t.pageX > pos.left && t.pageX < pos.left + w && t.pageY > pos.top && t.pageY < pos.top + h);
}
// -----------------------------------------------------------
