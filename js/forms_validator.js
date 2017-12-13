if(document.forms.length) 
document.forms[0].onsubmit = function() {
    // Очищаем список ошибок
    document.getElementById('error').innerHTML = ''
    if (this.id == 'form_signup') {
        user_name = this.login.value
        personal_name = this.personalname.value
        password = this.password.value
        conf_password = this.confpassword.value
        // Выводим ошибки
        if (!user_name) document.getElementById('error').appendChild(NewDivError("Enter user name"))
        else if (!new RegExp(/^([a-zа-яё0-9_]+)$/i).test(user_name)) document.getElementById('error').appendChild(NewDivError("Invalid user name, only letters, numbers and _"))
        if (!personal_name) document.getElementById('error').appendChild(NewDivError("Enter personal name"))
        if (!password) document.getElementById('error').appendChild(NewDivError("Enter password"))
        else if (!conf_password) document.getElementById('error').appendChild(NewDivError("Enter confirm password"))
        else if (password != conf_password) document.getElementById('error').appendChild(NewDivError("Passwords do not match"))        
    }
    else if(this.id == 'form_login') {
        login = this.login.value
        password = this.password.value
        // Выводим ошибки
        if (!login) document.getElementById('error').appendChild(NewDivError("Enter user name"))
        else if (!new RegExp(/^([a-zа-яё0-9_]+)$/i).test(login)) document.getElementById('error').appendChild(NewDivError("Invalid user name, only letters, numbers and _"))
        if (!password) document.getElementById('error').appendChild(NewDivError("Enter password"))
    }
    // Если нет ошибок отплавляем форму
    if (document.getElementById('error').innerHTML) return false
    else return true
}

// Создаем новый div с текстом ошибки
function NewDivError(text) {
    div = document.createElement('div')
    div.className = 'error'
    div.innerText = text
    return div
}