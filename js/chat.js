function Chat() {
	Socket.register("message", this);
	this.toggler = document.createElement("div");
	this.toggler.classList.add("chat-toggler");
	this.toggler.innerHTML = "Chat with opponent>";
	this.toggler.style.display = "none";
	this.toggler.addEventListener("click", this.toggleChat.bind(this, "show"));

	this.localChat = document.createElement("div");
	this.localChat.classList.add("local-chat");
	
	var toggler = document.createElement("div");
	toggler.classList.add("toggler");
	toggler.innerHTML = "Спрятать";
	toggler.addEventListener("click", this.toggleChat.bind(this, "hide"));

	var textbox = document.createElement("textarea");
	textbox.classList.add("textbox");
	textbox.setAttribute("placeholder", "Your message to the opponent");

	var messages = document.createElement("div");
	messages.classList.add("messages");
	
	var label = document.createElement("div");
	label.classList.add("label");
	label.innerHTML = "Chat";

	var message = messageElement('Referee', 'Well, here we begin!');
	this.localChat.appendChild(label);
	messages.appendChild(message);
	this.localChat.appendChild(messages);
	this.localChat.appendChild(textbox);
	this.localChat.appendChild(toggler);
	
	var self = this;
	textbox.addEventListener("keyup", function(e) {
		var key = e.keyCode;
		if (key == 13) {
			var message = messageElement('Me', e.target.value, true);
			Socket.sendMessage(e.target.value);
			var chatArea = self.localChat.getElementsByClassName("messages")[0];
			chatArea.appendChild(message);
			chatArea.scrollTop = chatArea.scrollHeight
			e.target.value = '';
		}
	});
	document.body.appendChild(this.localChat);
	document.body.appendChild(this.toggler);
}
Chat.prototype.toggleChat = function(way) {
	if (way == "hide") {
		this.localChat.style.display = "none";
		this.toggler.style.display = "block";
	} else if (way == "show") {
		this.localChat.style.display = "block";
		this.toggler.style.display = "none";
		this.localChat.getElementsByClassName("textbox")[0].focus();
	}
};
Chat.prototype.handleNewMessage = function(json, isMy) {
	var chatArea =this.localChat.getElementsByClassName("messages")[0];
	chatArea.appendChild(messageElement('Opponent', json.text));
	chatArea.scrollTop = chatArea.scrollHeight
};

Chat.prototype.close = function() {
	notice("Chat closed");
	this.localChat.remove();
};

Chat.prototype.dispatch = function(message) {
	var JSONmessage = JSON.parse(message);
	switch(JSONmessage.type) {
		case "message":
			this.handleNewMessage(JSONmessage);
			break;
	}
};

function GlobalChat() {
	Socket.register("message-history", this);
	Socket.register("message-all", this);
}

GlobalChat.prototype.close = function() {
	document.getElementById("chat").style.display = "none";
	document.getElementById("chat-button").classList.remove("active");
};

GlobalChat.prototype.newMessage = function(JSONmessage) {
	addMessage(JSONmessage.user_login, JSONmessage.text);
};

function messageElement(login, text, isMy) {
	if (login === undefined || login == null) {
		login = isMy ? 'Me' : 'Anonymous';
	}
	var message = document.createElement("div");
	var author = document.createElement("span");
	var content = document.createElement("div");

	if (isMy) {
		message.classList.add("message", "my");
	} else {
		message.classList.add("message");
	}
	author.classList.add("author");
	content.classList.add("text");

	author.innerHTML = login
	content.innerHTML = text
	message.appendChild(author);
	message.appendChild(content);	
	return message;
}

function addMessage(login, text, isMy) {
	var message = messageElement(login, text, isMy);
	var chatArea =	document.getElementById("chat").getElementsByClassName("chat-area")[0];
	chatArea.appendChild(message);
	chatArea.scrollTop = chatArea.scrollHeight
}

GlobalChat.prototype.myMessage = function(text) {
	Socket.messageAll(text);
	addMessage(USER_LOGIN, text, true);
};

GlobalChat.prototype.updateHistory = function(json) {
	for (var i = 0; i < json.size; ++i) {
		var isMy = undefined;
		if (json.messages[i].user_id == USER_ID) {
			isMy = true;
		}
		addMessage(json.messages[i].user_login, json.messages[i].text, isMy);
	}
};

GlobalChat.prototype.dispatch = function(message) {
	var JSONmessage = JSON.parse(message);
	switch(JSONmessage.type) {
		case "message-history":
			this.updateHistory(JSONmessage);
			break;
		case "message-all":
			this.newMessage(JSONmessage);
			break;
	}
};

