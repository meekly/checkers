function Communicator(login, userId) {
		if (login === undefined || login == null
				|| userId === undefined || userId == null) {
				alert("Вы не вошли на сайт. Для продолжения - войдите или зарегистрируйтесь");
				return;
		}

		this.activate(userId, login);
}

Communicator.prototype.activate = function(userId, login) {
				Socket.register("invite", this);
				Socket.register("invite-deny", this);
				Socket.register("invite-accept", this);
				Socket.register("change-status", this);
				Socket.register("busy", this);
}

Communicator.prototype.promptAPlay = function(json) {

};

Communicator.prototype.acceptPlay = function(json) {
		// Accept the play (Socket send)
};

Communicator.prototype.denyPlay = function(json) {

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
		var users = document.getElementsByClassName("users-list__user");
		for(var i = 0; i < users.length; ++i) {
				if (users[i].getAttribute("data-user-id") == json["user_id"]) {
						var user = users[i];
						break;
				}
		}
		if (i == users.length) {		// None was found
				var usersList = document.getElementById("users-list");
				console.log(usersList);
				var user = this.createNewUser(json);
				usersList.prepend(user);
				console.log(this.createNewUser(json));
		} else {
				var status = users.getElementsByClassName("users-list__user__status")[0];
				status.innerHTML = translateStatus(json["status"]);
		}

		if (translateStatus(json["status"]) == "Готов играть") {
				user.setAttribute("data-can-play", 1);
				user.addEventListener("click", this.handleInviteClick.bind(this, json));
		} else {
				user.setAttribute("data-can-play", 0);
		}
		
};

Communicator.prototype.handleInviteClick = function(user) {
		// FIXME более красивая форма
		if(myConfirm("Пригласить пользователя " + user.user_login + "?")) {
				Socket.invite(user.user_id);
		}
}

Communicator.prototype.dispatch = function(message) {
		// Show messages, accepting/denying plays
		var JSONmessage = JSON.parse(message);
		switch(JSONmessage.type) {
		case "invite":
				// Ask for a play
				this.promptAPlay(JSONmessage);
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
