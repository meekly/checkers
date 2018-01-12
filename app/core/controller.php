<?php

class Controller {	
  public $model;
  public $view;
  
  function __construct() {
    $this->view = new View();
    $this->model = new Model();
    // Инициализируем сессию
    session_start();
    if(!isset($_SESSION['name'])) {
      $_SESSION['name'] = 'guest';
    }
  }

  function game_action() {
    $this->view->game_view();
    $_SESSION['game_type'] = null;
  }

  function select_game_action($type) {
    $_SESSION['game_type'] = $type;
    header('Location: /');
  }

  function login_action() {
    // Если ломится не гость, то перенаправляем на его страницу
    if ($_SESSION['name'] != 'guest') header('Location: /mypage');
    // Если пришел логин и пароль пытаемся залогиниться
    if (isset($_POST['login'])) {
      if($user_id = $this->model->is_user($_POST['login'], $_POST['password'])) {
        $_SESSION['name'] = 'user';
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $this->model->get_username($user_id);
        $_SESSION['user_login'] = $_POST['login'];        
				header('Location: /mypage');
      }
      else $this->view->login_view("Неверный логин или пароль");
    }
    else $this->view->login_view();
  }

  function signup_action() {
    // Если ломится не гость, то перенаправляем на его страницу
    if ($_SESSION['name'] != 'guest') header('Location: /mypage');
    // Если пришли данные для регистрации
    if (isset($_POST['login'])) {
      // Если не нашли пользователя с таким именем, то регестрируем
      if (!$this->model->is_user($_POST['login'])) {
	      $this->model->signup();
	      $this->view->msg_view("Вы успешно зарегестрированы");				
      }
      else {
	      $this->view->signup_view("Имя пользователя уже занято!");
      }			
    }
    else $this->view->signup_view();
  }
  
  function logout_action() {
    $_SESSION['name'] = 'guest';
    $_SESSION['user_id'] = null;
    $_SESSION['user_name'] = null;
    $_SESSION['user_login'] = null;
    header('Location: /');
  }

  function mypage_action() {
    $this->view->mypage_view();
  }
}