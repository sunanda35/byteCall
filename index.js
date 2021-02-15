const express = require('express');     //import express
const http = require('http');
const path = require('path');
const socket = require('socket.io');
const {uuid} = require('uuidv4');
require('dotenv').config()          //using .env file

var app = express();
const server = http.createServer(app);
const io = socket(server);
var id=500;

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '/public')));
////////////////////////////
// app.get('/:id', function(req, res) {
//     id = req.params.id;
// });
//////////////////////
app.get('/', (req, res)=>{
    // res.render('call')
    // console.log(uuid())
    res.redirect(`/${uuid()}`)
})
app.get('/:callid', (req, res)=>{
    res.render('call', {callID: req.params.callid})
})

io.on('connection', socketio =>{
    socketio.on('join-room', (callID, user)=>{
        // console.log(callID, user)
        socketio.join(callID)
        socketio.emit('message', {
        user: null,
        message: 'Welcome to byteCall'
        });    //Welcome message for us
        socketio.to(callID).broadcast.emit('message',{
            user: null,
            message: `${user} joined the meeting!`
        })
        socketio.on('chatting',msg =>{
        // console.log(msg)
            io.to(callID).emit('message', msg);
        })
        socketio.on('disconnect', ()=>{
            io.to(callID).emit('message', {
                user: null,
                message: `${user} just disconnected!`
        })
    })

    })


    // socketio.join(id);
    // console.log('our WS is connected now....');
    // console.log(id)           //////////////////////////
    // // socketio.emit('id',socketio.id);
    // // console.log(socketio.id)
    // socketio.to(id).emit('message', {
    //     user: null,
    //     message: 'Welcome to byteCall'
    // });
    // socketio.broadcast.emit('message',{
    //     user: null,
    //     message: 'A new user joined the meeting!'
    // })




    // })


})


const PORT = process.env.PORT || 3000;          //configure port like (localhost:3000)
server.listen(PORT, 
    ()=>{
        console.log(`Server started at: http://127.0.0.1:${PORT}`);
    })