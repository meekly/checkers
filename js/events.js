function bindEvents() {
		// Если кнопка активна, то переинициализируем игру
    if (document.getElementById("online").className) {
        Game.reinitGame("online");
    } else if (document.getElementById("multi").className) {
        Game.reinitGame("multi");
    } else if (!document.getElementById("single").className) {
        document.getElementById("single").className = "selected_game";
        Game.reinitGame("single");
    }
    
    // Кнопки в меню
		["single", "multi", "online"].forEach(function(item){
		    document.getElementById(item).onclick = function() {
						clearClassButtons();
						this.className = "selected_game";
						Game.reinitGame(item);
				}		
		});
		
    function clearClassButtons() {
        // Остальные кнопки остаются ненажатымиe
				["single", "multi", "online"].forEach(function(item){
						document.getElementById(item).className = "";
				})
		}

    /** CLEAR CLASS BUTTONS */
		//document.getElementById("new_online").className = "";
		//document.getElementById("new_multi").className = "";
		//document.getElementById("new_single").className = "";
		
		/** START NEW GAME BUTTONS */
		[["single", "/"],
		 ["multi", "offline"],
		 ["online", "online"]].forEach(function (item) {
				 document.getElementById(item[0]).onclick = new Function("location.href = '"+item[1]+"'");
		 });
		
		/*
		document.getElementById("single").onclick = function() {
				location.href = '/';
		}
		document.getElementById("multi").onclick = function() {
				location.href = '/offline';
		}
		document.getElementById("online").onclick = function() {
				location.href = '/online';
		}
		*/
}
