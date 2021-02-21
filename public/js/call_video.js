const videoGrid = document.getElementById('video-grid')


const peer = new Peer({
  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' }
  ]} /* Some google's free stun server and it is fast! */
});

const myVideo = document.createElement('video');
myVideo.muted= true;
const peers = {};

peer.on('open', id=>{
  socketio.emit('join-room', callID, nameData, id)
})
// socketio.emit('join-room', callID, peerid from stun server)

let streamControl;
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ 
    video: {
      frameRate: 25,
      width: {
        min: 480,
        ideal: 720,
        max: 1280
      },
      aspectRatio: 1.33333,
    }, 
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
    
  })
    .then(function (stream) {
      streamControl=stream;

      addVideoStream(myVideo, streamControl)
      peer.on('call', call=>{
        call.answer(streamControl)
        const video = document.createElement('video')
        call.on('stream', userVideoStream=>{

          addVideoStream(video, userVideoStream)
        })
        call.on('close', ()=>{
          video.remove();
        })
      })


      socketio.on('connected-user', msg=>{
        connectToNewUser(msg.id, streamControl)
      })
      socketio.on('disconnect-user', msg=>{
        console.log(msg.user)
        if(peers[msg.id])peers[msg.id].close()
      })
      
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
function connectToNewUser(userid, streamControl){
  const call = peer.call(userid, streamControl);
  const video = document.createElement('video');
  call.on('stream', userVideoStream=>{
    addVideoStream(video, userVideoStream)
  })
  call.on('close', ()=>{
    video.remove();
  })
  peers[userid] = call
}

function addVideoStream(video, streamControl){
  video.srcObject = streamControl;
  video.addEventListener('loadedmetadata', ()=>{
      video.play();
  })
  var random = Math.floor(Math.random() * 100000);
  video.className = 'videoElement';
  video.id = random;
  videoGrid.append(video);
}


let isAudio = true
function muteAudio() {
  if(streamControl != null && streamControl.getAudioTracks().length > 0){
    isAudio = !isAudio
    streamControl.getAudioTracks()[0].enabled = isAudio
  }
    
}

let isVideo = true
function muteVideo() {
  if(streamControl != null && streamControl.getVideoTracks().length > 0){
    isVideo = !isVideo
    streamControl.getVideoTracks()[0].enabled = isVideo
  }
    
}

let isScreenShare = false;
async function startCapture() {
  isScreenShare = !isScreenShare;
  await navigator.mediaDevices.getDisplayMedia(
    {
      cursor: true
    }
  ).then(function(stream){
    streamControl=stream;
    const video = document.createElement('video');
    video.className='sc_capture'
    addVideoStream(video, stream)
    stream.onended = () => { 
      var shareVideo = document.getElementsByName("sc_capture");
        video.remove();     
      console.info("Recording has ended");
      alert('This capture uable to see your friends!')
    };
    
  });
}
