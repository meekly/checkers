<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>checkers</title>
    <!--LINK CSS-->
    <link href="css/style.css" rel="stylesheet">
  </head>
  <body>
    <div class="main">
      <!--HEADER-->
      <nav>
				<a href="/"><img src="img/king-black.png"> Cool Checkers</a>
				
				<button id="login-button" onclick="location.href = '/login'">
					<?php if ($_SESSION['name'] == 'guest'): ?>
            Log in
					<?php else: ?>
            Log out            
          <?php endif ?>
        </button>
				
        <span id="single">vs computer</span>
        <?php if (!empty($_SESSION['game_type']) && $_SESSION['game_type'] == "offline"): ?>
          <span id="multi" class="selected_game">offline</span>
        <?php else: ?>
          <span id="multi">offline</span>
        <?php endif ?>

				<?php if (!empty($_SESSION['game_type']) && $_SESSION['game_type'] == "online"): ?>
          <span id="online" class="selected_game">online</span>
        <?php else: ?>
          <span id="online">online</span>
        <?php endif ?>     
      </nav>
      
      <div id="content">
        <?php include 'app/views/'.$content_view; ?>
      </div>

      <!--FOOTER-->
      <footer>© Andrey, Valentin 2017</footer>

      <!--SCRIPTS-->
      <?php if (!empty($script)): ?>
        <?php foreach ($script as $item): ?>
          <script src=js/<?=$item?>></script>
        <?php endforeach ?>
      <?php endif ?>
      
    </div>
  </body>
</html>
