const express = require('express');     //import express
const http = require('http');
const path = require('path');
const socket = require('socket.io');
require('dotenv').config()          //using .env file

var app = express();
const server = http.createServer(app);
const io = socket(server);
var id;

app.use(express.static(path.join(__dirname, '/public')));
app.get('/:id', function(req, res) {
    id = req.params.id;
});

io.on('connection', socketio =>{
    socketio.join(id);
    console.log('our WS is connected now....');
    console.log(id)           //////////////////////////
    // socketio.emit('id',socketio.id);
    // console.log(socketio.id)
    socketio.to(id).emit('message', {
        user: null,
        message: 'Welcome to byteCall'
    });
    socketio.broadcast.emit('message',{
        user: null,
        message: 'A new user joined the meeting!'
    })

    socketio.on('chatting',msg =>{
        // console.log(msg)
        io.to(id).emit('message', msg);
    })

    socketio.on('disconnect', ()=>{
        io.to(id).emit('message', {
            user: null,
            message: 'A user just disconnected!'
        })
    })


})


const PORT = process.env.PORT || 3000;          //configure port like (localhost:3000)
server.listen(PORT, 
    ()=>{
        console.log(`Server started at: http://127.0.0.1:${PORT}`);
    })    // it the main connection with server