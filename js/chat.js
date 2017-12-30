function Chat() {
		Socket.register("message", this);
}

Chat.prototype.dispatch = function(message) {
		// Add to chat window
		alert(message); //... yet
};
