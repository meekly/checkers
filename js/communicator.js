function Communicator(userId,login, name) {
	if (login === undefined || login == null
		|| userId === undefined || userId == null) {
		notice("Вы не вошли на сайт. Для продолжения - войдите или зарегистрируйтесь");
		return;
	}
	this.userId = userId;
	this.login = login;
	this.userName = name;
	this.activate();
	setInterval(this.clearExited.bind(this),  10000); // 1 min
}

Communicator.prototype.activate = function() {
	Socket.register("invite", this);
	Socket.register("invite-deny", this);
	Socket.register("invite-accept", this);
	Socket.register("change-status", this);
	Socket.register("busy", this);
	Socket.register("opponent-surrender", this);
	console.log("Logged in: " + LOGGED_IN);
	if (LOGGED_IN) {
		Socket.connectMe(this.userId, this.login, this.userName); 
	}
};

Communicator.prototype.handleInvitation = function(json) {
	var self = this;
	ask("Принять игру от пользователя "+json.user_id+"?", function() {
		Socket.acceptPlay(json.user_id);
		self.moveToOnline("white");
	}, function() {
		Socket.denyPlay(json.user_id);
	});
};

Communicator.prototype.handleInviteClick = function(user) {
	ask("Пригласить пользователя " + user.user_login + "?",
		function(){
			Socket.invite(user.user_id);
			notice("Запрос отправлен пользователю "+user.user_login);
	});
};

Communicator.prototype.acceptPlay = function(json) {
	// Accept the play (Socket send)
	notice("Пользователь "+json.user_id+" принял ваш запрос");
	this.moveToOnline("black");
};
Communicator.prototype.moveToOnline = function(color) {
	Game.reinitGame("online", color);
	["single", "multi"].forEach(function(item){
		document.getElementById(item).className = "";
	})
	notice("Если вы решите сдаться, просто обновите страницу или выберите другой режим игры");
	document.getElementById("online").style['display'] = 'block';
};
Communicator.prototype.denyPlay = function(json) {
	notice("Пользователь "+json.user_id+" отказал вам в игре");
};

Communicator.prototype.handleOpponentSurrender = function() {
	notice("Противник сдался");
	Game.opponentSurrender(); // Opponent surrendered so we win
};

Communicator.prototype.clearExited = function() {
	var users = document.getElementsByClassName("users-list__user");
	var forDeletion = [];
	for(var i = 0; i < users.length; ++i) {
		if (users[i].getAttribute("data-delete") == "1") {
			forDeletion.push(users[i]);
		}
	}
	forDeletion.forEach(function(item){item.remove();});
};

Communicator.prototype.createNewUser = function(json) {
	var user = document.createElement("div");
	user.classList.add("users-list__user");							// Creating a new user in list
	user.setAttribute("data-user-id", json["user_id"]); // Setting ID
	var userName = document.createElement("span");
	userName.classList.add("users-list__user__name");
	userName.innerHTML = json["user_name"];
	var userLogin = document.createElement("span");
	userLogin.classList.add("users-list__user__login");
	userLogin.innerHTML = json["user_login"];

	var userStatus = document.createElement("i");
	userStatus.classList.add("users-list__user__status");
	userStatus.innerHTML = translateStatus(json["status"]);

	user.appendChild(userName);
	user.appendChild(userLogin);
	user.appendChild(userStatus);
	return user;
};


Communicator.prototype.changeUserStatus = function(json) {
	if (json.user_id === undefined || json.user_id == null) return;
	var users = document.getElementsByClassName("users-list__user");
	for(var i = 0; i < users.length; ++i) {
		if (users[i].getAttribute("data-user-id") == json["user_id"]) {
			var user = users[i];
			break;
		}
	}
	if (i == users.length) {		// None was found
		var usersList = document.getElementById("users-list");
		var user = this.createNewUser(json);
		usersList.prepend(user);
	} else {
		var status = user.getElementsByClassName("users-list__user__status")[0];
		status.innerHTML = translateStatus(json["status"]);
	}

	if (translateStatus(json["status"]) == "Готов играть") {
		user.setAttribute("data-can-play", 1);
		user.addEventListener("click", this.handleInviteClick.bind(this, json));
	} else if (translateStatus(json["status"]) == "Только что вышел"
	|| translateStatus(json["status"]) == "Непонятно") {
		user.setAttribute("data-delete", 1);
	} else {
		user.setAttribute("data-can-play", 0);
		user.removeEventListener("click", this.handleInviteClick.bind(this, json));
	}
};

Communicator.prototype.dispatch = function(message) {
	// Show messages, accepting/denying plays
	var JSONmessage = JSON.parse(message);
	switch(JSONmessage.type) {
		case "invite":
			// Ask for a play
			this.handleInvitation(JSONmessage);
			break;
		case "invite-accept":
			// Game accepted
			this.acceptPlay(JSONmessage);
			break;
		case "invite-deny":
			this.denyPlay(JSONmessage);
			break;
		case "change-status":
			// Display status of a player
			this.changeUserStatus(JSONmessage);
			break;
		case "opponent-surrender":
			this.handleOpponentSurrender();
			break;
	}
};

// {"type":"change-status", "user_id": //..., "user_name": //..., "status": ("online"|"offline"|"busy")}
function translateStatus(status) {
	switch(status) {
		case "online":
			return "Готов играть";
		case "offline":
			return "Только что вышел";
		case "busy":
			return "В бою";
		default:
			return "Непонятно";
	}
}
