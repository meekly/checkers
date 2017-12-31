function Communicator(login, userId) {
		if (login === undefined || login == null
				|| userId === undefined || userId == null) {
				alert("Вы не вошли на сайт. Для продолжения - войдите или зарегистрируйтесь");
				return;
		}

		this.activate(userId, login);

}

Communicator.prototype.activate = function(userId, login) {
		if (Socket.active()) {
				Socket.send("connect&"+userId+"&"+login); // Send socket that I am active
				Socket.register("invite", this);
				Socket.register("invite-deny", this);
				Socket.register("invite-accept", this);
				Socket.register("change-status", this);
				Socket.register("busy", this);
		} else {
				setTimeout(this.activate.bind(this, userId, login), 30000);
		}
}

Communicator.prototype.playWith = function(user_id) {
		// Play with the user (Socket send)
};

Communicator.prototype.acceptPlay = function(user_id) {
		// Accept the play (Socket send)
};

Communicator.prototype.denyPlay = function(user_id) {

};

Communicator.prototype.dispatch = function(message) {
		// Show messages, accepting/denying plays
};
