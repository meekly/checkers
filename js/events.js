// Если кнопка активна, то переинициализируем игру
function bindEvents() {
    if (document.getElementById("online").className) {
        Game.reinitGame("online");
    } else if (document.getElementById("multi").className) {
        Game.reinitGame("multi");
    } else if (!document.getElementById("single").className) {
        document.getElementById("single").className = "selected_game";
        Game.reinitGame("single");
    }
    
    // Нажимаем на кнопки
    document.getElementById("single").onclick = function() {
        clearClassButtons();
        this.className = "selected_game";
        Game.reinitGame("single");
    }
    document.getElementById("multi").onclick = function() {
        clearClassButtons();
        this.className = "selected_game";
        Game.reinitGame("multi");
    }
    document.getElementById("online").onclick = function() {
        clearClassButtons();
        this.className = "selected_game";
        Game.reinitGame("online");
    }
    
    function clearClassButtons() {
        // Остальные кнопки остаются ненажатыми
        document.getElementById("online").className = "";
        document.getElementById("multi").className = "";
        document.getElementById("single").className = "";
    }

        /** CLEAR CLASS BUTTONS */
    //document.getElementById("new_online").className = "";
    //document.getElementById("new_multi").className = "";
    //document.getElementById("new_single").className = "";
    
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
}