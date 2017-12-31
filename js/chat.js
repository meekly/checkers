function Chat() {
		Socket.register("message", this);
}

function GlobalChat() {
		Socket.register("message-history", this);
}

GlobalChat.prototype.dispatch = function(message) {
//		alert(message);
}

Chat.prototype.dispatch = function(message) {
		// Add to chat window
	//	alert(message); //... yet
};
