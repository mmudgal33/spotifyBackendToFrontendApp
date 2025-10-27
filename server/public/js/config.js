
// const API = 'http://127.0.0.1:5000';
const API = 'https://spotifybackendtofrontendapp-1.onrender.com';

var PlaylistUri = "";
var DeviceId = "";


let PlayButton = document.getElementById("Play");

function Teste(target) {
    target.style.border = "2px solid #1AA34A";
    PlaylistUri = target.id;
    console.log('target.id ',target.id);
} 

function Teste2(target) {
    target.style.border = "2px solid #1AA34A";
    DeviceId = target.id;
    console.log('target.id ',target.id);
}



PlayButton.onclick = function() {
    console.log('DeviceId', DeviceId);
    if(PlaylistUri != "" && DeviceId != ""){
        var url = `${API}/player?playlist=${PlaylistUri}&device=${DeviceId}`;
        window.location.href = url;
    }
}


