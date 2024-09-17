const socket = io('/');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('../static/audio.mp3');

// TO change chat background
var i=["../static/a.jpg", "../static/b.jpg", "../static/c.jpg", "../static/d.jpg", "../static/e.jpg", "../static/f.jpg", "../static/g.jpg", "../static/h.jpg", "../static/i.jpg", "../static/j.jpg"];

function change(){
  var num=Math.floor(Math.random()*i.length)
  document.getElementById("chat").style.backgroundImage = 'url("'+i[num]+'")';
}

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    const time_div = document.createElement('div');
    messageElement.appendChild(time_div);
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    let date = new Date();
    if(date.getHours() > 12){
       hours = date.getHours() - 12;
    }
    else{
       hours = date.getHours();
    }
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    if (date.getHours() >= 12){
        ampm = "pm";
    }
    else {
        ampm = "am";
    }
    time_div.classList.add('time');
    time_div.innerHTML = `${hours}:${minutes} ${ampm}`;
    messageElement.append(time_div);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
    if(position == 'center'){
        time_div.classList.remove('time');
        time_div.innerHTML = '';
    }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'center')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'center')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})