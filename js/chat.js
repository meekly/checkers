function Chat() {
	Socket.register("message", this);
}

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

Chat.prototype.dispatch = function(message) {
	// Add to chat window
	//	alert(message); //... yet
};
