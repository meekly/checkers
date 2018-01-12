function bindEvents() {
	// Если кнопка активна, то переинициализируем игру
	//if (document.getElementById("online").className) {
	//    Game.reinitGame("online");
	//} else if (document.getElementById("multi").className) {
	//    Game.reinitGame("multi");
	//} else if (!document.getElementById("single").className) {
	//    document.getElementById("single").className = "selected_game";
	//    Game.reinitGame("single");
	//}
	Game.reinitGame('single');

	// Кнопки в меню
	["single", "multi"].forEach(function(item){
		document.getElementById(item).onclick = function() {
			clearClassButtons();
			this.className = "selected_game";
			document.getElementById("online").style['display'] = 'none';
			Game.reinitGame(item);
		}		
	});

	function clearClassButtons() {
		// Остальные кнопки остаются ненажатымиe
		["single", "multi"].forEach(function(item){
			document.getElementById(item).className = "";
		})
	}

	// USERS_LIST TOGGLER EVENT
	document.getElementsByClassName("users-list__label")[0].addEventListener("click", function(e){
		document.getElementsByClassName("users-list__toggler")[0].style.display = "block";
		document.getElementById("users-list").style.display = "none";
	});
	document.getElementsByClassName("users-list__toggler")[0].addEventListener("click", function(e){
		document.getElementById("users-list").style.display = "block";
		document.getElementsByClassName("users-list__toggler")[0].style.display = "none";
	});;

	// CHAT TOGGLER
	document.getElementById("chat-button").addEventListener("click", function(e){
		var chat = document.getElementById("chat");
		if (e.target.classList.contains("active")) {
			chat.style.display = "none";
			e.target.classList.remove("active");
		} else {
			e.target.classList.add("active");
			chat.style.display = "block";
		}
	});

	// GLOBAL CHAT TEXTBOX
	document.getElementsByClassName("textbox")[0]
		.getElementsByTagName("textarea")[0]
		.addEventListener("keyup", function(e) {
		var key = e.keyCode;
		if (key == 13) {
			var textarea = document.getElementsByClassName("textbox")[0].getElementsByTagName("textarea")[0]
			notice(textarea.value);
			textarea.value = '';
			return false;
		} else if (key == 27) {
			globalChat.close();
			return false;
		} else {
			return true;
		}
	});
}
