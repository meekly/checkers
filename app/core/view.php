<?php

const CORE_JS = array(
	'checkers_game.js',
	'communicator.js',
	'events.js',
	'socket.js',
	'chat.js',
	'main.js',
);

class View {
	function game_view() {		
		$this->_generate('game_view.php', CORE_JS);
	}
	function msg_view($msg) {
		$this->_generate('msg_view.php', array('events.js'), $msg);
	}
	function login_view($msg = null) {
		$this->_generate('login_view.php', array_merge(CORE_JS, array('forms_validator.js')), $msg);
	}
	function signup_view($msg = null) {
		$this->_generate('signup_view.php', array_merge(CORE_JS, array('forms_validator.js')), $msg);
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
