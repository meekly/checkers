var Game, Socket;
document.addEventListener("DOMContentLoaded", function(){
	Socket = openSocket();
	Game = new Checkers();
	bindEvents();
	// Инициализация классов, ответственных за отображение пользователей
	// Ошибок быть не должно. Просто окошко: игра возможна только в режиме Оффлайн
});
