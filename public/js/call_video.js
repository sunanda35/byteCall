
const peer = new Peer({
  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' }
  ]} /* Sample servers, please use appropriate ones */
});


const video = document.querySelector('#videoData')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')

let myVideoStream;
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
    audio: false
    // {
    //   echoCancellation: true
    // }
  })
    .then(function (stream) {
      // video.srcObject = stream;
      myVideoStream = stream;
      addVideoStream(myVideo, stream);

      socketio.on('connect', (callID)=>{
        connectToNewUser(callID, stream)
      })
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
peer.on('open', id=>{
  socketio.emit('join-room', callID, id)
})


const connectToNewUser = (callID, stream)=>{
  const call = peer.call(callID, stream);
  const video = document.createElement('video')
  call.on('stream', userVideoStream=>{
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream = (video, stream)=>{
  video.srcObject = stream;
  video.addEventListener('loadmetadata', ()=>{
    video.play();
  })
  myVideo.append(video);
}