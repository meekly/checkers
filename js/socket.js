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
        }
        catch(exc) {
            debug("bad server answer " + exc.name);
						debug(exc);
        }        
		}

		socket.active = function() {
				return socket.readyState == 3;
		};

    // Обработчик закрытия соединения
    socket.onclose = function(e) {        
        debug("socket closed: " + e.code);
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
