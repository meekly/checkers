<!--LOGIN-->
<div id="login" class="form-wrapper">
    <label for="form-login">Login to site</label>    
    <form id="form_login" method="POST">            
        <input type="text" name="login" maxlength="32" minlength="3" placeholder="user name" class="input-text"><br>
        <input type="password" name="password" maxlength="32" minlength="5" placeholder="password" class="input-text">
        <div id="error">
            <?php if (!empty($data)): ?>
                <div class="error"><?=$data?></div>
            <?php endif ?>
        </div><br>
        <input type="submit" value="Log in" class="button button-blue">
        <button type="button" class="button button-green" onclick="location.href='/signup'">Sign up</button>
    </form>
        
</div>