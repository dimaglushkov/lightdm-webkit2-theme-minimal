function getDateTime() {
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
        // Start default session
        // let body = document.getElementById('body');
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

document.addEventListener('keydown', function(e) {
    // Start the dialog on pressing 'ALT'
    if(e.keyCode !== 18) {
        return;
    }

    var lat = prompt('Latitude: ', localStorage.getItem(cacheKeyLat) || '')
    var lon = prompt('Longitude: ', localStorage.getItem(cacheKeyLon) || '')
    localStorage.setItem(cacheKeyLat, lat);
    localStorage.setItem(cacheKeyLon, lon);

    // Update night mode immediately
    switchNightMode(is_dark(lat, lon));
})

document.addEventListener('DOMContentLoaded', function() {
    if(window.lightdm !== undefined && lightdm.hostname !== undefined) {
        document.getElementById('pagetitle').innerText = lightdm.hostname;
    }
    
    if(window.greeter_config === undefined) {
        var cfg = {greeter: {time_language: 'auto', time_format: 'LT'}};
    } else {
        var cfg = greeter_config;
    }

    if(cfg.greeter.time_language !== 'auto') {
        moment.locale(cfg.greeter.time_language);
    }
    document.getElementById('time').innerHTML = getDateTime();
    // let format = cfg.greeter.time_format;
    
    // // Update time now and once a second after that
    // let time = ;
    // time.innerHTML = moment().format(format);
    // setInterval(() => {
    // 	time.innerHTML = getDateTime();
    // }, 1000);
    
    // If only one user found, prefill the form
    if(window.lightdm.users.length === 1) {
        document.getElementById('username').value = lightdm.users[0].username;
        document.getElementById('password').focus();
    }

    var lat = localStorage.getItem(cacheKeyLat) || 53.0958;
    var lon = localStorage.getItem(cacheKeyLon) || 8.8995;

    // Update night mode calculation
    switchNightMode(is_dark(lat, lon));
    setInterval(() => {
        switchNightMode(is_dark(lat, lon));
    }, 60 * 1000);
});



let form = document.getElementById('login');
form.addEventListener('submit', handle_input);