const spotifyController = require('express').Router()
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require("lyrics-finder")

const dotenv = require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
    // Production optimizations
    REDIRECT_URI='https://spotifybackendtofrontendappf.onrender.com',
    API='https://spotifybackendtofrontendapp.onrender.com'
  } else {
    // Development features
    REDIRECT_URI='http://127.0.0.1:3000',
    API='http://127.0.0.1:5000'
  }


//////////////////////////////////////////  BACKEND APP CODE  //////////////////////////////////////////////

// const API = 'https://spotifybackendtofrontendapp.onrender.com';
// const API = 'http://127.0.0.1:5000'



const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

var spotifyApi = new SpotifyWebApi({

    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // redirectUri: 'http://127.0.0.1:5000/callback',
    redirectUri: 'https://spotifybackendtofrontendapp.onrender.com/callback',
    
});




let idUser = "";
let access_token = "";
let MusicPlaying;

class Playlist {
    constructor(name, cover, uri, owner) {
        this.name = name;
        this.cover = cover;
        this.uri = uri;
        this.owner = owner;
    }
}

class Device {
    constructor(name, type, id) {
        this.name = name;
        this.type = type;
        this.id = id;
    }
}


spotifyController.get('', (req, res) => {
    res.render("login");
});



spotifyController.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});



spotifyController.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            console.log(data);
            access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            //console.log("access token: " + access_token);
            spotifyApi.setRefreshToken(refresh_token);

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                access_token = data.body['access_token'];
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);

            res.redirect('/main');
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
        });
});


spotifyController.get('/main', (req, res) => {

    Promise.all([
        spotifyApi.getMyTopArtists({ limit: 20, time_range: 'long_term' }),
        spotifyApi.getMyTopTracks({ limit: 20, time_range: 'long_term' }),
        spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 }),
        spotifyApi.getMyCurrentPlaybackState(),
        spotifyApi.getMyCurrentPlayingTrack(),
        spotifyApi.getMe()
    ])
        .then(function ([artistData, trackData, recentlyPlayedData, playbackStateData, playingData, meData]) {
            let artists = artistData.body.items.map(artist => artist.name).join('# ');
            let music = trackData.body.items.map(track => `${track.name} - ${track.artists[0].name}`).join('# ');
            let RecentMusic = recentlyPlayedData.body.items.map(item => `${item.track.name} - ${item.track.artists[0].name}`).join('# ');
            let playingMusic = "";
            let playingArtist = "";
            let playingphoto = "";
            //   console.log('artistData: ',artistData);
            //   console.log('############################################################################');
            //   console.log('trackData: ',trackData);
            //   console.log('recentlyPlayedData: ',recentlyPlayedData);
            //   console.log('playbackStateData: ',playbackStateData);
            //   console.log('playingData: ',playingData);
            //   console.log('meData: ', meData);

            //   console.log('playingData.body.item.album: ', playingData.body.item.album);

            if (playbackStateData.body && playbackStateData.body.is_playing) {
                playingMusic = playingData.body.item.name;
                playingArtist = playingData.body.item.artists[0].name;
                playingphoto = playingData.body.item.album.images[0].url;
                MusicPlaying = true;
            }
            else {
                playingMusic = "Clique";
                playingArtist = "Play to continue what was playing";
                playingphoto = "images/nada.jpeg";
                MusicPlaying = false;
            }
            idUser = meData.body.id;
            console.log("music name: " + playingMusic);
            console.log("artist name: " + playingArtist);
            console.log("photo url: " + playingphoto)
            res.render("main", { artists: artists, music: music, RecentMusic: RecentMusic, playingMusic: playingMusic, playingArtist: playingArtist, playingphoto: playingphoto });
            console.log("main", { artists: artists, music: music, RecentMusic: RecentMusic, playingMusic: playingMusic, playingArtist: playingArtist, playingphoto: playingphoto })
            // res.json({ artists: artists, music: music, RecentMusic: RecentMusic, playingMusic: playingMusic, playingArtist: playingArtist, playingphoto: playingphoto });
        },
         function (err) {
            res.redirect(`${API}/error?error=${err.statusCode}`);
            console.log('error', err)
        });
});






spotifyController.get('/config', (req, res) => {
    Promise.all([
        spotifyApi.getUserPlaylists(idUser),
        spotifyApi.getMyDevices()
    ])
        .then(function ([playlistsData, devicesData]) {
            let ArrayPlaylist = [];
            let ArrayDevices = [];

            //   console.log('playlistsData.body.items[0]: ',playlistsData.body.items[0]);
            console.log('playlistsData.body.items[0].name: ', playlistsData.body.items[0].name);
            console.log('playlistsData.body.items[0].images: ', playlistsData.body.items[0].images[0].url);
            console.log('playlistsData.body.items[0].uri: ', playlistsData.body.items[0].uri);
            console.log('playlistsData.body.items[0].owner.display_name: ', playlistsData.body.items[0].owner.display_name);

            if (playlistsData.body.items.length < 1) {
                p = new Playlist("Sem playlists", "images/nada.jpeg", "Add playlists to your library to exchange them here.");
                ArrayPlaylist.push(p);
            }
            else {
                for (i = 0; i < playlistsData.body.items.length; i++) {
                    //   p = new Playlist(playlistsData.body.items[i].name, playlistsData.body.items[i].images[0].url, playlistsData.body.items[i].uri, playlistsData.body.items[i].owner.display_name);
                    p = new Playlist(playlistsData.body.items[i].name, playlistsData.body.items[0].images[0].url, playlistsData.body.items[i].uri, playlistsData.body.items[i].owner.display_name);
                    ArrayPlaylist.push(p);
                }
            }
            if (devicesData.body.devices.length < 1) {
                d = new Device("No active devices", "Launch Spotify on any device and reload it to make it appear here.");
                ArrayDevices.push(d);
            }
            else {
                for (i = 0; i < devicesData.body.devices.length; i++) {
                    d = new Device(devicesData.body.devices[i].name, devicesData.body.devices[i].type, devicesData.body.devices[i].id);
                    ArrayDevices.push(d);
                }
            }
            res.render('config', { ArrayPlaylist: ArrayPlaylist, ArrayDevices: ArrayDevices });
            console.log('config', { ArrayPlaylist: ArrayPlaylist, ArrayDevices: ArrayDevices })
            
        }, function (err) {
            res.redirect(`${API}/error?error=${err.statusCode}`);
            console.log('error', err)
        });
});






spotifyController.get('/player', async (req, res) => {


    var playlist = req.query.playlist;
    var device = req.query.device;
    console.log('playlist ', playlist);
    // console.log(playlist.cover);
    console.log('device ', device);

    spotifyApi.play({
        "context_uri": playlist,
        "device_id": device,
    })
        .then(function () {
            res.redirect(307, `${API}/main`);
            res.redirect(307, '/main');

        }, function (err) {
            res.redirect(`${API}/error?error=${err.statusCode}`);

            console.error('Play error:', err.body || err);

        });








});

spotifyController.get('/next', (req, res) => {
    if (MusicPlaying) {
        spotifyApi.skipToNext()
            .then(function () {
                res.redirect(307, `${API}/main`);
            }, function (err) {
                res.redirect(`${API}/error?error=${err.statusCode}`);
            });
    }
    else res.redirect(307, `${API}/main`);
});

spotifyController.get('/prev', (req, res) => {
    if (MusicPlaying) {
        spotifyApi.skipToPrevious()
            .then(function () {
                res.redirect(307, `${API}/main`);
            }, function (err) {
                res.redirect(`${API}/error?error=${err.statusCode}`);
            });
    }
    else res.redirect(307, `${API}/main`);
});

spotifyController.get('/mute', function (req, res) {
    spotifyApi.getMyCurrentPlaybackState()
        .then(function (data) {
            let currPorcVol = data.body.device.volume_percent;
            let newPorcVol;

            if (currPorcVol > 0) newPorcVol = 0;
            else newPorcVol = 100;

            spotifyApi.setVolume(newPorcVol)
                .then(function () {
                    res.redirect(307, `${API}/main`);
                }, function (err) {
                    res.redirect(`${API}/error?error=${err.statusCode}`);
                });
        })
});

spotifyController.get('/play', function (req, res) {
    spotifyApi.play({
        "data": "",
    })
        .then(function () {
            res.redirect(307, `${API}/main`);
        }, function (err) {
            res.redirect(307, `${API}/config`);
        });
});



spotifyController.get('/error', (req, res) => {
    var error = req.query.error
    // res.render('error', { error: error })
    res.send(`
    <h2> error in getting data </h2>
    <a href='/'> go to home page </a> &nbsp;
    `);
    
});




////////////////////////////////////////////  FRONTEND APP CODE  /////////////////////////////////////////////

const spotifyApi2 = new SpotifyWebApi({
    // redirectUri: process.env.REDIRECT_URI,
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: `${REDIRECT_URI}/callback`,
    
    // redirectUri: 'http://127.0.0.1:3000/callback',
    // redirectUri: 'https://spotifybackendtofrontendappF.onrender.com',
})




spotifyController.post('/login', (req, res) => {
    const code = req.body.code
    console.log('backend received', code)
    console.log(`redirectUri ,${REDIRECT_URI}/callback`)
    // const spotifyApi2 = new SpotifyWebApi({
    //     //   redirectUri: process.env.REDIRECT_URI,
    //     //   clientId: process.env.CLIENT_ID,
    //     //   clientSecret: process.env.CLIENT_SECRET,
    //     clientId: 'e257dc917f8640b5a9afe2f6e6ac1ef9',
    //     clientSecret: 'b7265469b062446b973c4ad5a4e24c53',
    //     redirectUri: 'http://127.0.0.1:3000/callback',
    //     // redirectUri: 'https://spotifybackendtofrontendapp-1.onrender.com/callback',
    // })

    spotifyApi2
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
            console.log('data ', data);
        })
        .catch(err => {
            res.sendStatus(400)
        })
})


spotifyController.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    // const spotifyApi = new SpotifyWebApi({
    //     //   redirectUri: process.env.REDIRECT_URI,
    //     //   clientId: process.env.CLIENT_ID,
    //     //   clientSecret: process.env.CLIENT_SECRET,
    //     clientId: 'e257dc917f8640b5a9afe2f6e6ac1ef9',
    //     clientSecret: 'b7265469b062446b973c4ad5a4e24c53',
    //     redirectUri: 'http://127.0.0.1:3000/callback',
    //     // redirectUri: 'https://spotifybackendtofrontendapp-1.onrender.com/callback',

    //     refreshToken,
    // })

    spotifyApi2
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})


spotifyController.get("/lyrics", async (req, res) => {
    console.log('lyrics', req);
    const lyrics =
      (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
  })

///////////////////////////////////// AUTHENTICATION //////////////////////////////////////////////

// API routes with authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token', token);
    if (!token) return res.status(401).json({ error: 'No token provided' });

    spotifyApi2.setAccessToken(token);
    next();
};

// User methods
spotifyController.get('/me', authenticate, async (req, res) => {
    console.log('inside /me')
    try {
        const user = await spotifyApi2.getMe();
        res.json(user.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Search methods
spotifyController.get('/search', authenticate, async (req, res) => {
    try {
        const { q, type = 'track' } = req.query;
        const results = await spotifyApi2.search(q, type.split(','));
        res.json(results.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Playlist methods
spotifyController.get('/playlists', authenticate, async (req, res) => {
    try {
        const playlists = await spotifyApi2.getUserPlaylists();
        res.json(playlists.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

spotifyController.post('/playlists', authenticate, async (req, res) => {
    try {
        const { name, description, public } = req.body;
        const playlist = await spotifyApi2.createPlaylist(name, {
            description,
            public: public || false
        });
        res.json(playlist.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Player methods
spotifyController.get('/player', authenticate, async (req, res) => {
    try {
        const player = await spotifyApi2.getMyCurrentPlaybackState();
        res.json(player.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

spotifyController.put('/player/play', authenticate, async (req, res) => {
    try {
        await spotifyApi2.play();
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

spotifyController.put('/player/pause', authenticate, async (req, res) => {
    try {
        await spotifyApi2.pause();
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Track methods
spotifyController.get('/tracks/:id', authenticate, async (req, res) => {
    try {
        const track = await spotifyApi2.getTrack(req.params.id);
        res.json(track.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user's top items
spotifyController.get('/top/:type', authenticate, async (req, res) => {
    try {
        const { type } = req.params; // 'tracks' or 'artists'
        const { limit = 20, time_range = 'medium_term' } = req.query;

        let data;
        if (type === 'tracks') {
            data = await spotifyApi2.getMyTopTracks({ limit, time_range });
        } else if (type === 'artists') {
            data = await spotifyApi2.getMyTopArtists({ limit, time_range });
        }

        res.json(data.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = spotifyController;


















































// // const port = 5000;
// const scopes = [
//     'ugc-image-upload',
//     'user-read-playback-state',
//     'user-modify-playback-state',
//     'user-read-currently-playing',
//     'streaming',
//     'app-remote-control',
//     'user-read-email',
//     'user-read-private',
//     'playlist-read-collaborative',
//     'playlist-modify-public',
//     'playlist-read-private',
//     'playlist-modify-private',
//     'user-library-modify',
//     'user-library-read',
//     'user-top-read',
//     'user-read-playback-position',
//     'user-read-recently-played',
//     'user-follow-read',
//     'user-follow-modify'
// ];

// var spotifyApi = new SpotifyWebApi({
//     // clientId: process.env.SPOTIFY_CLIENT_ID,
//     // clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     // redirectUri: "http://127.0.0.1:5000/callback",
//     clientId: 'e257dc917f8640b5a9afe2f6e6ac1ef9',
//     clientSecret: 'b7265469b062446b973c4ad5a4e24c53',
//     redirectUri: 'http://127.0.0.1:5000/callback'
// });



// let idUser = "";
// let access_token = "";
// let MusicPlaying;

// class Playlist {
//     constructor(name, cover, uri, owner) {
//         this.name = name;
//         this.cover = cover;
//         this.uri = uri;
//         this.owner = owner;
//     }
// }

// class Device {
//     constructor(name, type, id) {
//         this.name = name;
//         this.type = type;
//         this.id = id;
//     }
// }


// spotifyController.get('', (req, res) => {
//     res.render("login");
// });

// spotifyController.get('/login', (req, res) => {
//     res.redirect(spotifyApi.createAuthorizeURL(scopes));
// });

// spotifyController.get('/callback', (req, res) => {
//     const error = req.query.error;
//     const code = req.query.code;
//     const state = req.query.state;

//     if (error) {
//         console.error('Callback Error:', error);
//         res.send(`Callback Error: ${error}`);
//         return;
//     }

//     spotifyApi
//         .authorizationCodeGrant(code)
//         .then(data => {
//             console.log(data);
//             access_token = data.body['access_token'];
//             const refresh_token = data.body['refresh_token'];
//             const expires_in = data.body['expires_in'];

//             spotifyApi.setAccessToken(access_token);
//             //console.log("access token: " + access_token);
//             spotifyApi.setRefreshToken(refresh_token);

//             setInterval(async () => {
//                 const data = await spotifyApi.refreshAccessToken();
//                 access_token = data.body['access_token'];
//                 spotifyApi.setAccessToken(access_token);
//             }, expires_in / 2 * 1000);

//             res.redirect('/main');
//         })
//         .catch(error => {
//             console.error('Error getting Tokens:', error);
//             res.send(`Error getting Tokens: ${error}`);
//         });
// });

// spotifyController.get('/main', (req, res) => {

//     Promise.all([
//         spotifyApi.getMyTopArtists({ limit: 20, time_range: 'long_term' }),
//         spotifyApi.getMyTopTracks({ limit: 20, time_range: 'long_term' }),
//         spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 }),
//         spotifyApi.getMyCurrentPlaybackState(),
//         spotifyApi.getMyCurrentPlayingTrack(),
//         spotifyApi.getMe()
//     ])
//         .then(function ([artistData, trackData, recentlyPlayedData, playbackStateData, playingData, meData]) {
//             let artistas = artistData.body.items.map(artist => artist.name).join('# ');
//             let musicas = trackData.body.items.map(track => `${track.name} - ${track.artists[0].name}`).join('# ');
//             let musicasRecentes = recentlyPlayedData.body.items.map(item => `${item.track.name} - ${item.track.artists[0].name}`).join('# ');
//             let playingMusica = "";
//             let playingArtista = "";
//             let playingFoto = "";
//             if (playbackStateData.body && playbackStateData.body.is_playing) {
//                 playingMusica = playingData.body.item.name;
//                 playingArtista = playingData.body.item.artists[0].name;
//                 playingFoto = playingData.body.item.album.images[0].url;
//                 MusicPlaying = true;
//             }
//             else {
//                 playingMusica = "Clique";
//                 playingArtista = "Play para continuar o que estava tocando";
//                 playingFoto = "images/nada.jpeg";
//                 MusicPlaying = false;
//             }
//             idUser = meData.body.id;
//             /* console.log("nome da musica: " + playingMusica);
//             console.log("nome do artista: " + playingArtista);
//             console.log("url da foto" + playingFoto) */
//             res.render("main", { artistas: artistas, musicas: musicas, musicasRecentes: musicasRecentes, playingMusica: playingMusica, playingArtista: playingArtista, playingFoto: playingFoto });
//         }, function (err) {
//             res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//         });
// });

// spotifyController.get('/config', (req, res) => {
//     Promise.all([
//         spotifyApi.getUserPlaylists(idUser),
//         spotifyApi.getMyDevices()
//     ])
//         .then(function ([playlistsData, devicesData]) {
//             let ArrayPlaylist = [];
//             let ArrayDevices = [];

//             console.log('playlistsData: ', playlistsData.items)

//             if (playlistsData.body.items.length < 1) {
//                 p = new Playlist("Sem playlists", "images/nada.jpeg", "Adicione playlists na sua bibloteca para tocá-las por aqui.");
//                 ArrayPlaylist.push(p);
//             }
//             else {
//                 for (i = 0; i < playlistsData.body.items.length; i++) {
//                     // p = new Playlist(playlistsData.body.items[i].name, playlistsData.body.items[i].images[0].url, playlistsData.body.items[i].uri, playlistsData.body.items[i].owner.display_name);
//                     // p = new Playlist(playlistsData.body.items[i].name, playlistsData.body.items[i].images.url, playlistsData.body.items[i].uri, playlistsData.body.items[i].owner.display_name);
//                     p = new Playlist(playlistsData.body.items[i].name, playlistsData.body.items[0].images[0].url, playlistsData.body.items[i].uri, playlistsData.body.items[i].owner.display_name);
//                     ArrayPlaylist.push(p);
//                 }
//             }
//             if (devicesData.body.devices.length < 1) {
//                 d = new Device("Sem dispositivos ativos", "Inicie seu Spotify em algum dispositivo e recarregue para que ele apareça aqui.");
//                 ArrayDevices.push(d);
//             }
//             else {
//                 for (i = 0; i < devicesData.body.devices.length; i++) {
//                     d = new Device(devicesData.body.devices[i].name, devicesData.body.devices[i].type, devicesData.body.devices[i].id);
//                     ArrayDevices.push(d);
//                 }
//             }
//             res.render('config', { ArrayPlaylist: ArrayPlaylist, ArrayDevices: ArrayDevices });
//             console.log({ ArrayPlaylist: ArrayPlaylist, ArrayDevices: ArrayDevices })
//         }, function (err) {
//             res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//         });
// });

// spotifyController.get('/pause', (req, res) => {
//     if (MusicPlaying) {
//         spotifyApi.pause({
//             "data": "",
//         })
//             .then(function () {
//                 res.redirect(307, 'http://127.0.0.1:5000/main');
//             }, function (err) {
//                 res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//             });
//     }

//     else res.redirect(307, 'http://127.0.0.1:5000/main');

// });

// spotifyController.get('/player', (req, res) => {

//     var playlist = req.query.playlist;
//     var device = req.query.device;
//     //console.log(playlist);
//     //console.log(device);

//     spotifyApi.play({
//         "context_uri": playlist,
//         "device_id": device,
//     })
//         .then(function () {
//             res.redirect(307, 'http://127.0.0.1:5000/main');
//         }, function (err) {
//             res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//         });
// });

// spotifyController.get('/next', (req, res) => {
//     if (MusicPlaying) {
//         spotifyApi.skipToNext()
//             .then(function () {
//                 res.redirect(307, 'http://127.0.0.1:5000/main');
//             }, function (err) {
//                 res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//             });
//     }
//     else res.redirect(307, 'http://127.0.0.1:5000/main');
// });

// spotifyController.get('/prev', (req, res) => {
//     if (MusicPlaying) {
//         spotifyApi.skipToPrevious()
//             .then(function () {
//                 res.redirect(307, 'http://127.0.0.1:5000/main');
//             }, function (err) {
//                 res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//             });
//     }
//     else res.redirect(307, 'http://127.0.0.1:5000/main');
// });

// spotifyController.get('/mute', function (req, res) {
//     spotifyApi.getMyCurrentPlaybackState()
//         .then(function (data) {
//             let currPorcVol = data.body.device.volume_percent;
//             let newPorcVol;

//             if (currPorcVol > 0) newPorcVol = 0;
//             else newPorcVol = 100;

//             spotifyApi.setVolume(newPorcVol)
//                 .then(function () {
//                     res.redirect(307, 'http://127.0.0.1:5000/main');
//                 }, function (err) {
//                     res.redirect(`http://127.0.0.1:5000/erro?erro=${err.statusCode}`);
//                 });
//         })
// });

// spotifyController.get('/play', function (req, res) {
//     spotifyApi.play({
//         "data": "",
//     })
//         .then(function () {
//             res.redirect(307, 'http://127.0.0.1:5000/main');
//         }, function (err) {
//             res.redirect(307, 'http://127.0.0.1:5000/config');
//         });
// });

// spotifyController.get('/erro', (req, res) => {
//     var erro = req.query.erro
//     res.render('erro', { erro: erro })
// });


// module.exports = spotifyController;













