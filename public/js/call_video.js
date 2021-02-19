const videoGrid = document.getElementById('video-grid')


const peer = new Peer({
  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' }
  ]} /* Some google's free stun server and it is fast! */
});

const myVideo = document.createElement('video');
// myVideo.muted= true;
const peers = {};

peer.on('open', id=>{
  socketio.emit('join-room', callID, nameData, id)
})


if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ 
    video: {
      frameRate: 25,
      width: {
        min: 480,
        ideal: 720,
        max: 1280
      },
      aspectRatio: 1.33333
    }, 
    audio: {
      echoCancellation: true
    }
    
  })
    .then(function (stream) {
      addVideoStream(myVideo, stream)
      peer.on('call', call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream=>{
          addVideoStream(video, userVideoStream)
        })
      })


      socketio.on('connected-user', msg=>{
        connectToNewUser(msg.id, stream)
      })
      socketio.on('disconnect-user', msg=>{
        console.log(msg.user)
        if(peers[msg.user])peers[msg.user].close()
      })
      
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}

function connectToNewUser(userid, stream){
  const call = peer.call(userid, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream=>{
    addVideoStream(video, userVideoStream)
  })
  call.on('close', ()=>{
    video.remove();
  })
  peers[userid] = call
}

function addVideoStream(video, stream){
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', ()=>{
    video.play();
  })
  videoGrid.append(video);
}