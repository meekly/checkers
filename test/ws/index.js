// Run node index.js
var ws = require("nodejs-websocket")

var server = ws.createServer(function (conn) {
	console.log("New connection");

	// Adding a new user
	conn.sendText(
		JSON.stringify({"type":"change-status",
			"user_id":"4", 
			"user_login":"nickname1", 
			"user_name":"George",
			"status":"online"
		}));

	conn.on("text", function (str) {
		console.log("Received "+str)
		var recJson = JSON.parse(str);

		switch(recJson.type) {
			case 'invite': // Accepting a game
				conn.sendText(
					JSON.stringify({
						"type":"invite-accept",
						"user_id": "4"
					}));
				break;

				// If I ask for a game
			case 'invite-deny': 
				break;
			case 'invite-accept':
				break;
			default:
				console.log("Unknown type:"+recJson.type);
		}
	});

	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	});
}).listen(8888);
