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
			if ($row[2] == md5($password)) return $row[0];
			else return false;
		}
	}
	function signup() {
		$hash = md5($_POST['password']);
		return $this->mysqli->query("INSERT INTO users (login, password, name) VALUES ('{$_POST["login"]}', '{$hash}', '{$_POST["personalname"]}')");
	}
	function get_username($user_id) {
		return $this->mysqli->query("SELECT name FROM users WHERE user_id = '{$user_id}'")->fetch_object()->name;
	}

	// метод выборки данных
	public function get_data()
	{
		// todo
	}
}