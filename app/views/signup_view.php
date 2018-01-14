<!--SIGNUP-->
<div id="signup" class="form-wrapper">            
    <label for="form-signup">Sign up for forum</label>    
    <form id="form_signup" method="POST">        
        <input type="text" name="login" maxlength="32" minlength="3" placeholder="user name" class="input-text"><br>    
        <input type="text" name="personalname" maxlength="32" minlength="3" placeholder="personal name" class="input-text"><br>    
        <input type="password" name="password" maxlength="32" minlength="5" placeholder="password" class="input-text"><br>
        <input type="password" name="confpassword" maxlength="32" minlength="5" placeholder="confirm password" class="input-text">
        <div id="error">
            <?php if (!empty($data)): ?>
                <div class="error"><?=$data?></div>
            <?php endif ?>
        </div><br>
        <input type="submit" value="Sign up" class="button button-blue">
    </form>        
</div>
<script language="javascript">
	document.getElementById("multi").style.display = "none";
	document.getElementById("single").style.display = "none";
</script>
