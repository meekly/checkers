<?php
// Передача управления соответствующему контроллеру
function route() {
	$routes = explode('/', $_SERVER['REQUEST_URI']);
	$controller = new Controller();

	if(empty($routes[1])) {       
		$controller->game_action();
	}
	else if(empty($routes[2])) {        
		switch($routes[1]) {
		case 'login':
			$controller->login_action();
			break;
		case 'signup':
			$controller->signup_action();
			break;
		case 'logout':
			$controller->logout_action();
			break;
		case 'mypage':
			$controller->mypage_action();
			break;
		case 'offline':
		case 'online':
			$controller->select_game_action($routes[1]);
			break;
		default:
			header('Location: /');
		}
	}
	else {
		switch($routes[1]) {
		case 'login':
			header('Location: /login');
			break;
		case 'signup':
			header('Location: /signup');
			break;
		case 'logout':
			header('Location: /logout');
			break;
		case 'mypage':
			header('Location: /mypage');
			break;
		default:
			header('Location: /');
		}
	}
}
