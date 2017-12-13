<?php

class View {
	function game_view() {		
		$this->_generate('game_view.php', array('checkers_game.js', 'onclick_buttons_ingame.js'));
	}
	function msg_view($msg) {
		$this->_generate('msg_view.php', array('onclick_buttons_outgame.js'), $msg);
	}
	function login_view($msg = null) {
		$this->_generate('login_view.php', array('forms_validator.js', 'onclick_buttons_outgame.js'), $msg);
	}
	function signup_view($msg = null) {
		$this->_generate('signup_view.php', array('forms_validator.js', 'onclick_buttons_outgame.js'), $msg);
	}
	function mypage_view($msg = null) {
		$this->game_view();
		//$this->_generate();
	}

	private function _generate($content_view, $script = null, $data = null) {		
		/*
		if(is_array($data)) {
			
			// преобразуем элементы массива в переменные
			extract($data);
		}
		*/
		
		include 'app/views/template_view.php';
	}
}
