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
<div class="chat-area">
</div>
<div class="textbox">
	<textarea placeholder="Your message to all"></textarea>
</div>
</div>


<!-- Users online -->
<div id="users-list">
  <div class="users-list__label">
		Members online
  </div>
</div>
<div style="display: none;" class="users-list__toggler">Online&gt;</div>
