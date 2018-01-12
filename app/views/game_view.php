<script language="javascript">
<?php
if (isset($_SESSION['user_name'], $_SESSION['user_id'], $_SESSION['user_login'])) {
	echo "var LOGGED_IN = true;";
	echo "var USER_NAME = '{$_SESSION['user_name']}';";
	echo "var USER_ID = '{$_SESSION['user_id']}';";
	echo "var USER_LOGIN = '{$_SESSION['user_login']}';";
} else {
	echo "var LOGGED_IN = false";
}
?>
</script>

<!-- Checkers -->
<div id="game">
  <canvas id="field" width="800" height="800"></canvas>
</div>

<div id="chat">
<div class="message">
	<span class="author">Author</span>
	<div class="text">Text Lorem ipsum lalala</div>
</div>	

<div class="message my">
	<span class="author">Me</span>
	<div class="text">Text Lorem ipsum lalala</div>
</div>	
<div class="textbox">
	<textarea placeholder="Ваше сообщение всем"></textarea>
</div>
</div>


<!-- Users online -->
<div id="users-list">
  <div class="users-list__label">
		Пользователи онлайн
  </div>
</div>
<div class="users-list__toggler">В сети&gt;</div>
