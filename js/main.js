var Game, Socket, Darwin, chat;
document.addEventListener("DOMContentLoaded", function(){
		Socket = openSocket(); // Глобальный объект для отправки сообщений Socket.send()
		Game = new Checkers(); // Игра и всё, что связано с нейx
		Darwin = new Communicator('ian', 1); // Отвечает за вывод приглашений, показ страничек, связывает клиент и сервер
		chat = new Chat();
		

		bindEvents(); // Обработчики нажатий на кнопки
});
