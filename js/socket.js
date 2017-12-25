function openSocket() {
    var socket = new WebSocket('ws://127.0.0.1:8888');
    
    socket.onerror = function(error) {
        console.warn("connection error. ");
        Game.setSocketState("noconnection");
        Game._gameOver();
    }

    // Обработчик соединения
    socket.onopen = function() {
        console.log("socket opened");
    }

    // Обработчик получения сообщения от сервера
    socket.onmessage = function(e) {
        console.log("server answered: " + e.data);
        try {            
            var data = e.data.split('&');

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
        }
        catch(exc) {
            console.warn("bad server answer " + exc.name);
        }        
    }

    // Обработчик закрытия соединения
    socket.onclose = function() {        
        console.log("socket closed");
        if (Game.socketState == "run") {
            Game.setSocketState("error");
            //Game._gameOver();
        }
    }
    return socket;
}
