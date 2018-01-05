function Communicator(login, userId) {
		if (login === undefined || login == null
				|| userId === undefined || userId == null) {
				alert("Вы не вошли на сайт. Для продолжения - войдите или зарегистрируйтесь");
				return;
		}

		this.activate(userId, login);
}

Communicator.prototype.activate = function(userId, login) {
	//	if (Socket.active()) {
	//			Socket.send("connect&"+userId+"&"+login); // Send socket that I am active
				Socket.register("invite", this);
				Socket.register("invite-deny", this);
				Socket.register("invite-accept", this);
				Socket.register("change-status", this);
				Socket.register("busy", this);
	//	} else {
	//			setTimeout(this.activate.bind(this, userId, login), 30000);
	//	}
}

Communicator.prototype.playWith = function(user_id) {
		// Play with the user (Socket send)
};

Communicator.prototype.acceptPlay = function(user_id) {
		// Accept the play (Socket send)
};

Communicator.prototype.denyPlay = function(user_id) {

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
				usersList.prepend(this.createNewUser(json));
				console.log(this.createNewUser(json));
				return;
		}
		var status = users.getElementsByClassName("users-list__user__status")[0];
		status.innerHTML = translateStatus("status");
};


Communicator.prototype.dispatch = function(message) {
		// Show messages, accepting/denying plays
		var JSONmessage = JSON.parse(message);
		switch(JSONmessage.type) {
		case "change-status":
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
