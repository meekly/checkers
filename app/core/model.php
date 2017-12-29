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

	function is_user($login, $password = null) {		
		// TODO $login - обработать на наличие инъекций
		// Можно делать поиск сразу на соответствие логина и хеша пароля
		$row = $this->mysqli->query("SELECT * FROM users WHERE login = '{$login}'")->fetch_row();		

		// Если не нашли пользователя с таким же именем, можно регестрировать
		if (!empty($row) && !$password) return true;
		else if (!$password) return false;
		else {
			// Пытаемся залогинить
			if ($row[2] == md5($password)) return true;
			else return false;
		}
	}
	function signup() {
		$hash = md5($_POST['password']);
		return $this->mysqli->query("INSERT INTO users (login, password, name) VALUES ('{$_POST["login"]}', '{$hash}', '{$_POST["personalname"]}')");
	}

	function save_game_result($winner_id, $loser_id) {
		return $this->mysqli->query("INSERT INTO games (player1_id, player2_id) VALUES ('{$winner_id}', '{$loser_id}')");
	}

	// метод выборки данных
	public function get_data()
	{
		// todo
	}
}
