const chatForm = document.getElementById('msgInput');
const chatMsg = document.querySelector('.msg_container');
var messg = document.getElementById('message');

let socketio = io();

socketio.on('connect', ()=>{
    console.log('connected to server');
})
// socketio.on('id', url=>{
//     document.getElementById("url") = `http://localhost:3000/${url}`;
// })
socketio.on('message', message =>{
    setMessage(message);
    chatMsg.scrollTop = chatMsg.scrollHeight;
    window.scrollBy(100,100)
})

chatForm.addEventListener('submit', e =>{
    e.preventDefault();
    const message = e.target.elements.message.value; //get message from client
    // console.log(message)
    if(messg.value.length>=1){
    socketio.emit('chatting',{
        user: 'sunanda',
        message: message
    }); //sending message to server
}
    messg.value = '';
})

function setMessage(msg){
    const div = document.createElement('div');
    div.classList.add(`${
        msg.user==='sunanda'?"message_outgoing": msg.user===null?"message":"message_incomming"
    }`);
    div.innerHTML = `${
        msg.user!=null? `<h6>from ${msg.user==='sunanda'? 'you': msg.user}</h6><p>${msg.message}</p>`:`<p>${msg.message}</p>`
    }`;
    document.querySelector('.msg_container').appendChild(div)
}


