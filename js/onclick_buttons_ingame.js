/** INIT FIRST GAME */
if (document.getElementById("new_online").className)
    _reInitGame("online");
else if (document.getElementById("new_multi").className) 
    _reInitGame("multi");
else if (!document.getElementById("new_single").className) {
    document.getElementById("new_single").className = "selected_game";
    _reInitGame("single");
}

/** START NEW GAME BUTTONS */
document.getElementById("new_single").onclick = function() {
    clearClassButtons();
    this.className = "selected_game";
    _reInitGame("single");
}
document.getElementById("new_multi").onclick = function() {
    clearClassButtons();
    this.className = "selected_game";
    _reInitGame("multi");
}
document.getElementById("new_online").onclick = function() {
    clearClassButtons();
    this.className = "selected_game";
    _reInitGame("online");
}

function clearClassButtons() {
    document.getElementById("new_online").className = "";
    document.getElementById("new_multi").className = "";
    document.getElementById("new_single").className = "";
}