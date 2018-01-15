<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Шашечки</title>
    <!--LINK CSS-->
    <link href="css/style.css" rel="stylesheet">
  </head>
  <body>
    <div class="main">
      <!--HEADER-->
      <nav>
				<a href="/"><img src="img/king-black.png"> Cool Checkers</a>

				<div class="right-side">
					<button id="chat-button" class="menu-button" style="display: none;">Беседочка</button>					
						<?php if ($_SESSION['name'] == 'guest'): ?>
              <button id="login-button" class="menu-button" onclick="location.href = '/login'">
							Войти
						<?php else: ?>
              <button id="login-button" class="menu-button" onclick="location.href = '/logout'">
							Выйти
						<?php endif ?>
					</button>
				</div>

        <span id="single" class="selected_game">Против компьютера</span>
        <?php if (!empty($_SESSION['game_type']) && $_SESSION['game_type'] == "offline"): ?>
          <span id="multi" class="selected_game">С собой</span>
        <?php else: ?>
          <span id="multi">С собой</span>
        <?php endif ?>

          <span id="online" style="display: none;" class="selected_game">Онлайн</span>
      </nav>
      
      <div id="content">
        <?php include 'app/views/'.$content_view; ?>
      </div>

			<div class="notifications">
			</div>
      <!--FOOTER-->
      <footer>© Andrey, Valentin 2018</footer>

      <!--SCRIPTS-->
      <?php if (!empty($script)): ?>
        <?php foreach ($script as $item): ?>
          <script src=js/<?=$item?>></script>
        <?php endforeach ?>
      <?php endif ?>
      
    </div>
  </body>
</html>
