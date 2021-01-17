let current_session = 'greeter:config:session';

function get_date_time() {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = monthNames[now.getMonth()]; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 

    if(day.toString().length == 1) {
         day = '0' + day;
    }   
    if(hour.toString().length == 1) {
         hour = '0' + hour;
    }
    if(minute.toString().length == 1) {
         minute = '0' + minute;
    }
    if(second.toString().length == 1) {
         second = '0' + second;
    }   

    return (day + ' ' + month + ' ' + year + ', ' + hour + ':' + minute + ':' + second);
}

function clear_messages() {
    let messages = document.getElementById("messages");
    messages.innerHTML = "";
    messages.style.visibility = "hidden";
}

function select_session() {

}

function set_session() {
    console.log("lol")
}


window.show_prompt = function(text, type) {   
    password = document.getElementById("password");
    if(type === 'password') {
        lightdm.respond(password.value);
    }
};

window.show_message = function(text, type) {    
    if (0 === text.length) {
        return;
    }
    let messages = document.getElementById('messages');
    messages.style.visibility = "visible";
    if (type == 'error') {
        text = `<li style="color:red;">${text}</li>`;
    }
    messages.innerHTML = `${messages.innerHTML}${text}`;
};

window.authentication_complete = function() {  
    if (lightdm.is_authenticated) {
        lightdm.start_session_sync();
    } else {
        show_message("Authentication Failed", "error");
    }
};

window.start_authentication = function(username) {   
    clear_messages();
    lightdm.authenticate(username);
};

window.handle_input = function(e) {   
    let username = document.getElementById("username");
    start_authentication(username.value);
    
    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', function() {
    if(window.lightdm !== undefined && lightdm.hostname !== undefined) {
        document.getElementById('pagetitle').innerText = lightdm.hostname;
    }
    
    time = document.getElementById('time')
    setInterval(() => {
        time.innerHTML = get_date_time();
    }, 1000);
    document.getElementById('time').innerHTML = get_date_time();
    document.getElementById('session').innerHTML = lightdm.default_session

    if(window.lightdm.users.length === 1) {
        document.getElementById('username').value = lightdm.users[0].username;
        document.getElementById('password').focus();
    }

});



let form = document.getElementById('login');
form.addEventListener('submit', handle_input);