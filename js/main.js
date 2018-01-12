var USER_ID, USER_LOGIN, USER_NAME;
var LOGGED_IN, Game, Socket, Darwin, chat, globalChat;
document.addEventListener("DOMContentLoaded", function(){
	Socket = openSocket(); // Глобальный объект для отправки сообщений Socket.send()
	Darwin = new Communicator(USER_ID, USER_LOGIN, USER_NAME); // Отвечает за вывод приглашений, показ страничек, связывает клиент и сервер FIXME Нужно откуда-то брать логин и айди с именем
	Game = new Checkers(); // Игра и всё, что связано с нейx
	chat = new Chat();
	globalChar = new GlobalChat();


	bindEvents(); // Обработчики нажатий на кнопки
});


// HELPERS

function ajax(method, url, data, success, error) {
	// Success and Error callbacks
	if (success === undefined || success == null) {
		success = function(data) {
			console.log("Recieved with ajax:\n"+data);
		};
	}
	if (error === undefined || error == null) {
		error = function(data) {
			console.log("Error in ajax:\n"+data);
		}
	}

	// Matching methods
	var getRe = new RegExp("GET", "i");
	var postRe = new RegExp("POST", "i");

	// Callbacks settings
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
			if (xmlhttp.status >= 200 && xmlhttp.status <= 299) {
				success(xmlhttp.responseText);
			}
			else {
				error(xmlhttp.responseText);
			}
		}
	};

	// Sending
	if (getRe.test(method)) {		// GET
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
	else if (postRe.test(method)) { // POST
		xmlhttp.open("POST", url, true);		
		xmlhttp.send(data);
	}
}

// Confirmation
function myConfirm(message) {
	return prompt(message);
}
