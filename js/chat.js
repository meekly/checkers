function Chat() {
		Socket.register("message", this);
}

Chat.prototype.dispatch = function(message) {
		var text = message.split('&')[1];
		// Add to chat window
		alert(text); //... yet
};
