// const API = 'http://127.0.0.1:5000';
const API = 'https://spotifybackendtofrontendapp-1.onrender.com';
document.querySelector('.green-button').addEventListener('click', function() {
    var url = `${API}/login`;
    window.location.href = url;
});