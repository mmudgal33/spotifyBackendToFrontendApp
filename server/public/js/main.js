const topSongsButton = document.getElementById("topSongsButton");
const topArtistsButton = document.getElementById("topArtistsButton");
const recentSongsButton = document.getElementById("recentSongsButton");
const ConfigurarPlayerButton = document.getElementById("ConfigurarPlayerButton");
const muteButton = document.getElementById("muteButton");
const nextButton = document.getElementById("nextButton");
const pauseButton = document.getElementById("pauseButton");
const prevButton = document.getElementById("prevButton");
const caixaMusica = document.getElementById("caixa-musica");
const caixaArtista = document.getElementById("caixa-artista"); 
const caixaRecente = document.getElementById("caixa-musica-recente");
const playingMusic = document.getElementById("playing-music"); 
const ImagemPausePlay = document.getElementById("imagem-pause-play");
const erro = document.getElementById("erro");

// const API = 'http://127.0.0.1:5000';
const API = 'https://spotifybackendtofrontendapp-1.onrender.com';

if(playingMusic.textContent != null && playingMusic.textContent != 'Clique'){
    ImagemPausePlay.src = 'images/pause.svg';
}
else{
    ImagemPausePlay.src = 'images/play.svg';
}

topSongsButton.onclick = function() {
    if (caixaMusica.style.display != 'block') {
        caixaMusica.style.display = 'block';
        caixaArtista.style.display = 'none';
        caixaRecente.style.display = 'none';
        caixaPlayer.style.display = 'none'; 
        
    } else {
        caixaMusica.style.display = 'none';
    } 
};

topArtistsButton.onclick = function() {
    if (caixaArtista.style.display != 'block') {
        caixaArtista.style.display = 'block';
        caixaMusica.style.display = 'none';
        caixaRecente.style.display = 'none';
        caixaPlayer.style.display = 'none';
    } else {
        caixaArtista.style.display = 'none';
    }
};  

recentSongsButton.onclick = function() {
    if (caixaRecente.style.display != 'block') {
        caixaRecente.style.display = 'block';
        caixaMusica.style.display = 'none';
        caixaArtista.style.display = 'none';
        caixaPlayer.style.display = 'none';
    } else {
        caixaRecente.style.display = 'none';
    }
}

muteButton.onclick = function() {
    if(playingMusica.textContent == null || playingMusica.textContent == 'Clique em'){
        return;
    }
    else{
        var url = `${API}/mute`;
        window.location.href = url; 
    }
}

pauseButton.onclick = function() {
    
    if(playingMusic.textContent != null && playingMusic.textContent != 'Clique'){
        var url = `${API}/pause`;
        window.location.href = url; 
    }
    else{
        var url = `${API}/play`;
        window.location.href = url; 
    }

}

nextButton.onclick = function() {
    var url = `${API}/next`;
    window.location.href = url;
}

prevButton.onclick = function() {
    var url = `${API}/prev`;
    window.location.href = url;
}
ConfigurarPlayerButton.onclick = function() {
    var url = `${API}/config`;
    window.location.href = url;
}


