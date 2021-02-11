const chatForm = document.getElementById('msgInput');
const chatMsg = document.querySelector('.chat');

let socketio = io();

socketio.on('connect', ()=>{
    console.log('connected to server');
})
socketio.on('id', url=>{
    document.getElementById("url") = `http://localhost:3000/${url}`;
})
socketio.on('message', message =>{
    setMessage(message);
    chatMsg.scrollTop = chatMsg.scrollHeight;
})

chatForm.addEventListener('submit', e =>{
    e.preventDefault();
    const message = e.target.elements.message.value; //get message from client
    // console.log(message)
    socketio.emit('chatting',message); //sending message to server
})

function setMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<h6>from bose</h6><p>${msg}</p>`;
    document.querySelector('.chat').appendChild(div)
}

