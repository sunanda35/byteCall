var today = new Date();
var hour = today.getHours();
var min = today.getMinutes();
var date = today.toDateString();
var ampm = hour>=12? 'PM':'AM';
    hour = hour? hour % 12 : 12; 
  
document.getElementById("datetime").innerHTML = hour+':'+min+' '+ampm+' • '+date;

function create_UUID(){
    var nameset = document.getElementById("nameInput").value;
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    console.log(uuid)
    localStorage.setItem('MeetMe_name', nameset)
    console.log(localStorage.getItem('MeetMe_name'))
    window.open("/"+uuid)
}

function join_meeting(){
    var inputJoin = document.getElementById("linkorid").value;
    window.open('/'+inputJoin)
}

function isUUID(s){
    return s.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")?window.open(window.location.href+"/"+inputJoin):false;
}
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }