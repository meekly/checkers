/** VARIBLES */
/*
	var canvas, ctx, 
  fieldSize, scale = 100, gap = 2, 
  colorScheme, field, TURN, typeTurn, typeGame,
  imgKingBlack, imgKingWhite,
  socket, socketState;
*/

function CheckerField(color){
    this.color = color,
    this.checker = true;
}


/** INIT GAME */
function Checkers() {
    var self = this;
    this.initFieldSize = function() {    
        self.fieldSize = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
        self.fieldSize = Math.floor(self.fieldSize * 0.8);
        document.getElementById("field").style.width = self.fieldSize + "px";
        document.getElementById("field").style.height = self.fieldSize + "px";
    }   
    this.initFieldSize();
    window.onresize = this.initFieldSize;

    this.canvas = document.getElementById("field"); 
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "bold 90px Comic Sans MS";
    this.ctx.textAlign = "center";
    // Можно убрать
    this.colorScheme = {
        dark: "#4682B4",
        light: "#87CEFA",
        black: "black",
        white: "white"
    };
    // ---
    this.typeGame = "signle";
    this.TURN = "white";
    this.socketState = undefined;
    this.imgKingBlack = new Image();
    this.imgKingWhite = new Image();
    this.imgKingBlack.src = "img/king-black.png";
    this.imgKingWhite.src = "img/king-white.png";;
    // Click canvas listener
    this.canvas.addEventListener("click", function(evt) {
        if (self.typeGame != "multi" && self.TURN == "black") return;
        var rect = self.canvas.getBoundingClientRect();
				var x = Math.floor(8*(evt.clientX - rect.left) / self.fieldSize),
						y = Math.floor(8*(evt.clientY - rect.top) / self.fieldSize);        
        if (self.typeGame != "online" || self.socketState == "run") {
            self.playerTurn(x, y);
        }
    }, false);
    //init field
    this.field = new Array(8)
    for (var i = 0; i < 8; i++) {
        this.field[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            if ((i%2 != j%2) && j < 3) this.field[i][j] = new CheckerField(this.colorScheme.black);
            else if ((i%2 != j%2) && j > 4) this.field[i][j] = new CheckerField(this.colorScheme.white);
            else this.field[i][j] = {};
        }
    }
    this.typeTurn = this.analyzeField();
    this.scale = 100;
    this.gap = 2;
    this.drawField();
		Socket.register("turn", this);
		Socket.register("opponent-surrender", this);
}



Checkers.prototype.reinitGame = function(type) {
    this.TURN = "white";
    if (type != undefined) this.typeGame = type;
    if (type == "online") {
        /**
         * Сокет будет уже открыт. Нужно либо автоматически подобрать игрока,
         * либо как-то вывести список игроков, готовых играть. Сокет будет открываться 
         * при загрузке сайта.
         */
        console.log("Мы работаем над этим");
    }
    else { this.socketState = undefined; }
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if ((i%2 != j%2) && j < 3) this.field[i][j] = new CheckerField(this.colorScheme.black);
            else if ((i%2 != j%2) && j > 4) this.field[i][j] = new CheckerField(this.colorScheme.white);
            else this.field[i][j] = {};
        }
    }
    this.typeTurn = this.analyzeField();
    this.displayMessage(".");
    // FIXME
    setTimeout(this.displayMessage.bind(this,".."), 100);  // Lol :)
    setTimeout(this.displayMessage.bind(this,"..."), 200); // Loading......
    setTimeout(this.drawField.bind(this), 300);    
}

Checkers.prototype.drawField = function() {
    //clear field
    this.ctx.fillStyle = "#f0f0f0";
    this.ctx.fillRect(0, 0, this.fieldSize*2, this.fieldSize*2);
    //draw 
    for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++) {
        //draw rects
        this.ctx.fillStyle = (i + j) % 2 == 0 ? this.colorScheme.light : this.colorScheme.dark;
				this.ctx.fillRect(i*this.scale+this.gap, j*this.scale+this.gap, this.scale-this.gap*2, this.scale-this.gap*2);
        // Draw ckecker
        if ("checker" in this.field[i][j]) { this._circle(i, j, this.field[i][j].color, true); }
        // Draw ready(yellow) indication
        if("moveTo" in this.field[i][j]) { this._circle(i, j, "yellow", false); }
        // Draw king Image
        if("king" in this.field[i][j]) { 
            this.ctx.drawImage(this.field[i][j].color == "white" 
															 ? this.imgKingBlack 
															 : this.imgKingWhite, i*this.scale+this.scale/4, j*this.scale+this.scale/4, this.scale/2, this.scale/2);
        }
    }
}

Checkers.prototype._circle = function(x, y, color, fill) {
    var r = fill ? 0.75 : 0.8;
    if (color == "red" || color == "green" || (color == "silver" && fill)) r = 0.2;
    this.ctx.beginPath();
    this.ctx.arc(x*this.scale+this.scale/2, y*this.scale+this.scale/2, r*this.scale/2, 0, 2*Math.PI, false);    
    if (fill) { 
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color == "black" ? "white" : color == "white" ? "black" : color;                
    } else {
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = color;
    }   
    this.ctx.stroke(); 
}

/** ANALYZE FIELD */
Checkers.prototype.analyzeField = function() {
    var canBit = false;
    for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++)
        if ("checker" in this.field[i][j] 
            && this.field[i][j].color == this.TURN)
            if ("king" in this.field[i][j]) {
                if (this._isCanAttackKing(i, j)) canBit = true;
            }
    else if (this._isCanAttack(i, j)) canBit = true;    
    if (canBit) return "attack";

    var canMove = false
    if (!canBit) for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++)
        if ("checker" in this.field[i][j] 
            && this.field[i][j].color == this.TURN)
            if ("king" in this.field[i][j]) { 
                if (this._isCanMoveKing(i, j)) canMove = true;
            }
    else if (this._isCanMove(i, j)) canMove = true;

    if (canMove) { return "move"; } else {
        return "game over";
    }
}

Checkers.prototype._isCanAttack = function(x, y) {
    this.field[x][y].moveTo = [];
    var enemyColor = (this.TURN == "black") ? "white" : "black";
    //left up
    if (x-2 >= 0 && y-2 >= 0 
        && "checker" in this.field[x-1][y-1] 
        && this.field[x-1][y-1].color == enemyColor 
        && !("checker" in this.field[x-2][y-2]))
        this.field[x][y].moveTo.push([x-2, y-2]);         
    //right up
    if (x+2 < 8 
        && y-2 >= 0 
        && "checker" in this.field[x+1][y-1] 
        && this.field[x+1][y-1].color == enemyColor 
        && !("checker" in this.field[x+2][y-2]))
        this.field[x][y].moveTo.push([x+2, y-2]);
    //left down
    if (x-2 >= 0 
        && y+2 < 8 
        && "checker" in this.field[x-1][y+1] 
        && this.field[x-1][y+1].color == enemyColor 
        && !("checker" in this.field[x-2][y+2]))
        this.field[x][y].moveTo.push([x-2, y+2]);  
    //right down
    if (x+2 < 8 
        && y+2 < 8 && "checker" in this.field[x+1][y+1] 
        && this.field[x+1][y+1].color == enemyColor 
        && !("checker" in this.field[x+2][y+2]))
        this.field[x][y].moveTo.push([x+2, y+2]);                      
    
    if (this.field[x][y].moveTo.length == 0) {
        delete this.field[x][y].moveTo;
        return false;
    } else {
        return true;
    }
}

Checkers.prototype._isCanMove = function(x, y) {
    this.field[x][y].moveTo = [];
    if (this.TURN == "white") {        
        //white left
        if (x-1 >= 0 && y-1 >= 0 && !("checker" in this.field[x-1][y-1]))
            this.field[x][y].moveTo.push([x-1, y-1]);
        //white right
        if (x+1 < 8 && y-1 >= 0 && !("checker" in this.field[x+1][y-1]))
            this.field[x][y].moveTo.push([x+1, y-1]);      
    }
    else if (this.TURN == "black") {
        //black left
        if (x-1 >= 0 && y+1 < 8 && !("checker" in this.field[x-1][y+1]))
            this.field[x][y].moveTo.push([x-1, y+1]);
        //black right
        if (x+1 < 8 && y+1 < 8 && !("checker" in this.field[x+1][y+1]))
            this.field[x][y].moveTo.push([x+1, y+1]);    
    }
    if (this.field[x][y].moveTo.length == 0) {
        delete this.field[x][y].moveTo;
        return false;
    } else { return true; }
}

Checkers.prototype._isCanMoveKing = function(x, y) {
    this.field[x][y].moveTo = [];

    for (var k = 1; x+k < 8 && y+k < 8 && !("checker" in this.field[x+k][y+k]); k++)
        this.field[x][y].moveTo.push([x+k, y+k])
    for (var k = 1; x-k >= 0 && y+k < 8 && !("checker" in this.field[x-k][y+k]); k++)
        this.field[x][y].moveTo.push([x-k, y+k]);
    for (var k = 1; x-k >= 0 && y-k >= 0 && !("checker" in this.field[x-k][y-k]); k++)
        this.field[x][y].moveTo.push([x-k, y-k]);
    for (var k = 1; x+k < 8 && y-k >= 0 && !("checker" in this.field[x+k][y-k]); k++)
        this.field[x][y].moveTo.push([x+k, y-k]);

    if (this.field[x][y].moveTo.length == 0) {
        delete this.field[x][y].moveTo;
        return false;
    } else return true;
}


Checkers.prototype._isCanAttackKing = function(x, y) {
    this.field[x][y].moveTo = [];
    var enemyColor = (this.TURN == "black") ? "white" : "black";

    var findEnemyChecker = false;
    for (var k = 1; x+k < 8 && y+k < 8; k++) {        
        if (findEnemyChecker) {
            if ("checker" in this.field[x+k][y+k]) break;
            else this.field[x][y].moveTo.push([x+k, y+k])
        }
        else if ("checker" in this.field[x+k][y+k]) {
            if (this.field[x+k][y+k].color == enemyColor)
                findEnemyChecker = true;
            else break;
        }
    }
    findEnemyChecker = false;
    for (var k = 1; x-k >= 0 && y+k < 8; k++) {
        if (findEnemyChecker) {
            if ("checker" in this.field[x-k][y+k]) break;
            else this.field[x][y].moveTo.push([x-k, y+k])
        }
        else if ("checker" in this.field[x-k][y+k]) {
            if (this.field[x-k][y+k].color == enemyColor)
                findEnemyChecker = true;
            else break;
        }        
    }
    findEnemyChecker = false;
    for (var k = 1; x-k >= 0 && y-k >= 0; k++) {
        if (findEnemyChecker) {
            if ("checker" in this.field[x-k][y-k]) break;
            else this.field[x][y].moveTo.push([x-k, y-k])
        }
        else if ("checker" in this.field[x-k][y-k]) {
            if (this.field[x-k][y-k].color == enemyColor)
                findEnemyChecker = true;
            else break;
        }        
    }
    findEnemyChecker = false;
    for (var k = 1; x+k < 8 && y-k >= 0; k++) {
        if (findEnemyChecker) {
            if ("checker" in this.field[x+k][y-k]) break;
            else this.field[x][y].moveTo.push([x+k, y-k])
        }
        else if ("checker" in this.field[x+k][y-k]) {
            if (this.field[x+k][y-k].color == enemyColor)
                findEnemyChecker = true;
            else break;
        }        
    }

    if (this.field[x][y].moveTo.length == 0) {
        delete this.field[x][y].moveTo;
        return false;
    } else return true;
}

/** MAKE TURN */

Checkers.prototype.playerTurn = function(x, y) {
    var self = this;
    //activate checker for move or attack
    if ("moveTo" in this.field[x][y]) {
        if (this.activeX != undefined) this.drawField();
        this.activeX = x;
        this.activeY = y;
        this.field[x][y].moveTo.forEach(function(v) {
            var indicateColor = self.typeTurn == "move" ? "green" : "red";
            self._circle(v[0], v[1], indicateColor, true)
        });
        return;
    } 
    else if (this.activeX == undefined) return; // just click on void
    else {
        //move or attack 
        var canMoveAttack = false;
        this.field[this.activeX][this.activeY].moveTo.forEach(function(v) {            
            if (x == v[0] && y == v[1]) {                
                //move checker
                self.field[x][y] = self.field[self.activeX][self.activeY];
                self.field[self.activeX][self.activeY] = {};
                // Calling to Socket object!!!
                if (self.typeGame == "online") {
                    Socket.send("turn&" + activeX + "&" + activeY + "&" + x + "&" + y);
                }
                //console.log(activeX + "&" + activeY + "&" + x + "&" + y);
                //shift to king if possible
                if ((y == 0 && self.field[x][y].color == "white") ||
                    (y == 7 && self.field[x][y].color == "black")) self.field[x][y].king = true;
                //make attack
                if (self.typeTurn == "attack") if (!self._makeAttack(x, y)) return;
                
                self._endTurn();
                canMoveAttack = true;
                return;
            }
        });
        //diactivate checker (can't move/attack)
        if (!canMoveAttack) {
            this.activeX = undefined;        
            this.drawField();
        }
    }
}

Checkers.prototype._makeAttack = function(x, y) {
    //if king checker
    if ("king" in this.field[x][y]) {
        //remove dead checker
        var dx = (x - this.activeX) / Math.abs(x - this.activeX),
            dy = (y - this.activeY) / Math.abs(y - this.activeY),
            _x = this.activeX, _y = this.activeY;
        while ((_x += dx) != x && (_y += dy) != y)
            if ("checker" in this.field[_x][_y]) {
                this.field[_x][_y] = {};
                break;
            }                            
        //continue attack if possible
        if (this._isCanAttackKing(x, y)) {
            this.activeX = x;
            this.activeY = y;
            for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++)
                if ("moveTo" in this.field[i][j]) delete this.field[i][j].moveTo;
            this._isCanAttackKing(x, y);
            this.drawField();
            return false;
        } else { return true; }
    }
    //else if simple checker
    else {
        //remove dead checker
        this.field[(this.activeX+x)/2][(this.activeY+y)/2] = {};
        //continue attack if possible
        if (this._isCanAttack(x, y)) {
            this.activeX = x;
            this.activeY = y;
            for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++)
                if ("moveTo" in this.field[i][j]) delete this.field[i][j].moveTo;
            this._isCanAttack(x, y);
            this.drawField();
            return false;       
        } else { return true; }
    }
}

Checkers.prototype._endTurn = function() {
    this.activeX = undefined;
    //delete moveTo 
    for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++)
        if ("moveTo" in this.field[i][j]) delete this.field[i][j].moveTo;    
    this.TURN = (this.TURN == "white") ? "black" : "white";
    this.typeTurn = this.analyzeField();
    if (this.typeTurn == "game over") {
        this.drawField();
        this._gameOver();
        return;
    }
    if (this.TURN == "black") setTimeout(this.computerTurn.bind(this), 500);
    this.drawField();
}

Checkers.prototype._gameOver = function() {
		// Socket send gameover&win/loose
    if (this.typeGame == "single") {
        if (this.TURN == "white") setTimeout(this.displayMessage.bind(this,"YOU LOSE"), 1000);
        else setTimeout(this.displayMessage.bind(this, "YOU WIN"), 1000);
    }
    else if (this.typeGame == "multi") {
        if (this.TURN == "white") setTimeout(this.displayMessage.bind(this, "BLACK WIN"), 1000);
        else setTimeout(this.displayMessage.bind(this, "WHITE WIN"), 1000);
    }
    else if (this.typeGame == "online") {
        if (this.socketState == "error") {
            setTimeout(this.displayMessage.bind(this, "CONNECTION CLOSED", 45), 1000);
            this.TURN = "black";
            return;
        }
        else if (this.socketState == "noconnection") {
            setTimeout(this.displayMessage.bind(this, "NO CONNECTION TO THE SERVER", 40), 1000);
            this.TURN = "black";
            return;
        }
        else if (this.TURN == "white") setTimeout(this.displayMessage.bind(this, "YOU LOSE"), 1000);
        else setTimeout(this.displayMessage.bind(this, "YOU WIN"), 1000);
        this.socketState = undefined;
				//Socket.close();
    }
}

Checkers.prototype.computerTurn = function() {
    if (this.typeGame != "single") return;

    var amountActiveCheckers = 0, count = 0;
    for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++) if ("moveTo" in this.field[i][j]) amountActiveCheckers++;
    var randActiveChecker = Math.floor(amountActiveCheckers * Math.random()) + 1;

    for (var x = 0; x < 8; x++) for (var y = 0; y < 8; y++) {
        if ("moveTo" in this.field[x][y] && ++count >= randActiveChecker) {
            var randTurn = Math.floor(this.field[x][y].moveTo.length * Math.random())
            _x = this.field[x][y].moveTo[randTurn][0],
            _y = this.field[x][y].moveTo[randTurn][1];
            //move checker
            this.field[_x][_y] = this.field[x][y];
            this.field[x][y]  = {};
            //shift to king if possible
            if ((_y == 0 && this.field[_x][_y].color == "white") ||
								(_y == 7 && this.field[_x][_y].color == "black")) this.field[_x][_y].king = true;
            //make attack
            if (this.typeTurn == "attack") {
                this.activeX = x;
                this.activeY = y;
                if (!this._makeAttack(_x, _y)) {
                    this._circle(x, y, "silver", true);
                    setTimeout(this.computerTurn.bind(this), 500);
                    return;
                }                
            }
            this._endTurn();
            //draw last turn indicator
            this._circle(_x, _y, "silver", false);
            this._circle(x, y, "silver", true);
            return;
        }
    }    
}

Checkers.prototype.onlineTurn = function(fromX, fromY, toX, toY) {
    //reflect coordinates
    fromX = 7 - fromX;
    fromY = 7 - fromY;
    toX = 7 - toX;
    toY = 7 - toY;
    //move checker
    this.field[toX][toY] = this.field[fromX][fromY];
    this.field[fromX][fromY] = {};
    //shift to king if possible
    if ((toY == 0 && this.field[toX][toY].color == "white") ||
				(toY == 7 && this.field[toX][toY].color == "black")) this.field[toX][toY].king = true;
    //make attack
    if (typeTurn == "attack") {
        this.activeX = fromX;
        this.activeY = fromY;
        if (!this._makeAttack(toX, toY)) {
            this._circle(fromX, fromY, "silver", true);            
            return;
        }                
    }
    this._endTurn();
    //draw last turn indicator
    this._circle(toX, toY, "silver", false);
    this._circle(fromX, fromY, "silver", true);
}

/** DRAW MESSAGE */
Checkers.prototype.displayMessage = function(message, fontsize) {
    if (fontsize) {
        this.ctx.font = "bold " + fontsize + "px Comic Sans MS";
    }
    this.ctx.fillStyle = "#111";        
    this.ctx.fillText(message, this.scale*4, this.scale*4+this.scale/4)
    if (fontsize) {
        this.ctx.font = "bold 90px Comic Sans MS";
    }
}

Checkers.prototype.setSocketState = function(state) {
    this.socketState = state;
}

Checkers.prototype.dispatch = function(message) {
		var tokens = JSON.parse(message);
		switch (tokens["type"]) {
		case 'turn':
				this.onlineTurn(tokens["fromX"], tokens["fromY"], tokens["toX"], tokens["toY"]);
				break;
		case 'opponent-surrender':
				this._gameOver();
				break;
		}
}
