// function socketUse(io, socketio){
//     console.log('our WS is connected now....');
//     // socketio.emit('id',socketio.id);
//     // console.log(socketio.id)
//     socketio.emit('message', {
//         user: null,
//         message: 'Welcome to byteCall'
//     });
//     socketio.broadcast.emit('message',{
//         user: null,
//         message: 'A new user joined the meeting!'
//     })

//     socketio.on('chatting',msg =>{
//         // console.log(msg)
//         io.emit('message', msg);
//     })

//     socketio.on('disconnect', ()=>{
//         io.emit('message', {
//             user: null,
//             message: 'A user just disconnected!'
//         })
//     })

// }
