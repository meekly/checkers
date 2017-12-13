DROP TABLE games;
DROP TABLE users;

/*œŒÀ‹«Œ¬¿“≈À»*/
CREATE TABLE users(
	user_id INT(8) NOT NULL AUTO_INCREMENT,
	login VARCHAR(32) NOT NULL,
	password CHAR(32) NOT NULL,
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY(user_id)
);

/*–≈«”À‹“¿“€ —€√–¿Õ€’ »√–*/
CREATE TABLE games(
	game_id INT(8) NOT NULL AUTO_INCREMENT,
	player1_id INT(8) NOT NULL,
	player2_id INT(8) NOT NULL,
	date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(game_id),
	FOREIGN KEY(player1_id)
		REFERENCES users(user_id),
	FOREIGN KEY(player2_id)
		REFERENCES users(user_id)
);