// Если кнопка активна, то переинициализируем игру
if (document.getElementById("online").className) {
    _reInitGame("online");
} else if (document.getElementById("multi").className) {
    _reInitGame("multi");
} else if (!document.getElementById("single").className) {
    document.getElementById("single").className = "selected_game";
    _reInitGame("single");
}

// Нажимаем на кнопки
document.getElementById("single").onclick = function() {
    clearClassButtons();
    this.className = "selected_game";
    _reInitGame("single");
}
document.getElementById("multi").onclick = function() {
    clearClassButtons();
    this.className = "selected_game";
    _reInitGame("multi");
}
document.getElementById("online").onclick = function() {
    clearClassButtons();
    this.className = "selected_game";
    _reInitGame("online");
}

function clearClassButtons() {
    // Остальные кнопки остаются ненажатыми
    document.getElementById("online").className = "";
    document.getElementById("multi").className = "";
    document.getElementById("single").className = "";
}
