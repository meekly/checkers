/** CLEAR CLASS BUTTONS */
document.getElementById("new_online").className = "";
document.getElementById("new_multi").className = "";
document.getElementById("new_single").className = "";

/** START NEW GAME BUTTONS */
document.getElementById("new_single").onclick = function() {
    location.href = '/';
}
document.getElementById("new_multi").onclick = function() {
    location.href = '/offline';
}
document.getElementById("new_online").onclick = function() {
    location.href = '/online';
}