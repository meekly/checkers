var DEBUG = true;
function debug(message) { if(DEBUG === true) { console.log(message); } }
function openSocket() {
    var socket = new WebSocket('ws://127.0.0.1:8888');

		socket.dispatcherList = {};	// List of objects (may be in future list of arrays of objects)

		socket.register = function(message, object) {
				socket.dispatcherList[message] = object;
		};
		
    socket.onerror = function(error) {
        debug("connection error. ");
        Game.setSocketState("noconnection");
        // Game._gameOver();				
    }

    // Обработчик соединения
    socket.onopen = function() {
        debug("socket opened");
    }

    // Обработчик получения сообщения от сервера
    socket.onmessage = function(e) {
        debug("server answered: " + e.data);
        try {            
            var type = JSON.parse(e.data)["type"];
						if (socket.dispatcherList[type] !== undefined) {
								socket.dispatcherList[type].dispatch(e.data);
						} else {
								debug("Unable to dispatch type: "+type);
						}
						
						/* Old method
            if (data[0] == "msg") {
                if (data[1] == "wait") {
                    Game.setSocketState("wait");
                    setTimeout('displayMessage("WAIT FOR ENOTHER PLAYER", 48)', 500);
                }
                else if (data[1] == "run") {
                    if (data[2] == "black") {
                        Game._endTurn();

                    }
                    Game.setSocketState("run");
                    Game.drawField();
                }
                else if (data[1] == "stop") {
                    socket.close;  
                    Game.setSocketState("closed");
                }
            }
            else if (data[0] == "turn") Game.onlineTurn(data[1], data[2], data[3], data[4]);
						*/
        }
        catch(exc) {
            debug("bad server answer " + exc.name);
						console.log(exc);
        }        
    }
		socket.active = function() {
				return socket.readyState == 3;
		};
    // Обработчик закрытия соединения
    socket.onclose = function() {        
        console.log("socket closed");
        if (Game.socketState == "run") {
            Game.setSocketState("error");
            //Game._gameOver();
        }
    };

		// Исходящие сообщения
		socket.invite = function(userId) {
				socket.send(
						JSON.stringify({
								type: "invite",
								user_id: userId
						}));
		};
		
    return socket;
}
