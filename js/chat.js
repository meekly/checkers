function Chat() {
		Socket.register("message", this);
}

function GlobalChat() {
		Socket.register("message-history", this);
}

GlobalChat.prototype.dispatch = function(message) {
	switch(message.type) {
		case "message-history":
			this.updateHistory(message);
			break;
	}
}

Chat.prototype.dispatch = function(message) {
		// Add to chat window
	//	alert(message); //... yet
};
