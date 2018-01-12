var USER_ID, USER_LOGIN, USER_NAME;
var LOGGED_IN, Game, Socket, Darwin, chat, globalChat;
window.addEventListener('load', function(){
	Socket = openSocket(); // Глобальный объект для отправки сообщений Socket.send()
	Darwin = new Communicator(USER_ID, USER_LOGIN, USER_NAME); // Отвечает за вывод приглашений, показ страничек, связывает клиент и сервер FIXME Нужно откуда-то брать логин и айди с именем
	Game = new Checkers(); // Игра и всё, что связано с нейx
	chat = new Chat();
	globalChat = new GlobalChat();


	bindEvents(); // Обработчики нажатий на кнопки
});

window.onbeforeunload = function(){
	Socket.close();
};

// HELPERS


// Confirmation
function ask(message, yesCallback, noCallback) {
	if (yesCallback === undefined || yesCallback == null) {
		yesCallback = function(){};
	}
	if (noCallback === undefined || noCallback == null) {
		noCallback = function(){};
	}

	var confirmation = document.createElement("div");
	confirmation.classList.add("confirmation");
	confirmation.innerHTML = message;
	var res = null;
	var given = false;

	var yesBtn = document.createElement("button");
	yesBtn.classList.add("yes-btn");
	yesBtn.innerHTML = "Да";
	yesBtn.addEventListener("click", function() {
		document.body.removeChild(confirmation);
		yesCallback();
	});

	var noBtn = document.createElement("button");
	noBtn.classList.add("no-btn");
	noBtn.innerHTML = "Нет";
	noBtn.addEventListener("click", function() {
		document.body.removeChild(confirmation);
		noCallback();
	});
	var buttons = document.createElement("div");
	buttons.classList.add("buttons");
	buttons.appendChild(yesBtn);
	buttons.appendChild(noBtn);
	confirmation.appendChild(buttons);
	document.body.appendChild(confirmation);
	return res;
//	return prompt(message);
}

// Notice function
function notice(message) {
	var notification = document.createElement("div");
	notification.classList.add("notice");
	notification.innerHTML = message;
	document.getElementsByClassName("notifications")[0].appendChild(notification);
	setTimeout(function() {
		document.getElementsByClassName("notifications")[0].removeChild(notification);
	}, 5000);
}

// If ajax is needed
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
