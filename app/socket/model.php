<?php

class Model {
	private $mysqli;

	function __construct() {
		// Подключаемся к базе дынных
		$this->mysqli = new mysqli("localhost", "root", "", "checkers");
		if ($this->mysqli->connect_error) return false;
		else {			
			return true;
		}
	}
	function __destruct() {
		$this->mysqli->close();
    }
    
	function save_game_result($winner_id, $loser_id) {
		return $this->mysqli->query("INSERT INTO games (player1_id, player2_id) VALUES ('{$winner_id}', '{$loser_id}')");
	}
}
