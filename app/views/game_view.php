<script language="javascript">
<?php
if (isset($_SESSION['user_name'], $_SESSION['user_id'], $_SESSION['user_login'])) {
	echo "var LOGGED_IN = true";
	echo "var USER_NAME = {$_SESSION['user_name']};";
	echo "var USER_ID = {$_SESSION['user_id']};";
	echo "var USER_LOGIN = {$_SESSION['user_login']};";
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
  
</div>


<!-- Users online -->
<div id="users-list">
<!--
  <div class="users-list__user" data-user-id="1" data-can-play="0">
    <span class="users-list__user__name">Freddy</span>
    <span class="users-list__user__login">fred56</span>
    <i class="users-list__user__status">Скучает</i>
  </div>
-->
	
  <div class="users-list__label">
    Users online
  </div>
</div>
<div class="users-list__toggler">Users online></div>
