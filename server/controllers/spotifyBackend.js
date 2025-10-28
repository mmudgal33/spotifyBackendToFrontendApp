
const spotifyBackend = require('express').Router()
const lyricsFinder = require("lyrics-finder")

const SpotifyWebApi = require('spotify-web-api-node');



const spotifyApi = new SpotifyWebApi({
    //   redirectUri: process.env.REDIRECT_URI,
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    clientId: 'e257dc917f8640b5a9afe2f6e6ac1ef9',
    clientSecret: 'b7265469b062446b973c4ad5a4e24c53',
    redirectUri: 'http://127.0.0.1:3000/callback',
    // redirectUri: 'https://spotifybackendtofrontendapp-1.onrender.com/callback',
})





spotifyBackend.post('/login', (req, res) => {
    const code = req.body.code
    console.log('backend received', code)
    // const spotifyApi = new SpotifyWebApi({
    //     //   redirectUri: process.env.REDIRECT_URI,
    //     //   clientId: process.env.CLIENT_ID,
    //     //   clientSecret: process.env.CLIENT_SECRET,
    //     clientId: 'e257dc917f8640b5a9afe2f6e6ac1ef9',
    //     clientSecret: 'b7265469b062446b973c4ad5a4e24c53',
    //     redirectUri: 'http://127.0.0.1:3000/callback',
    //     // redirectUri: 'https://spotifybackendtofrontendapp-1.onrender.com/callback',
    // })

    spotifyApi
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


spotifyBackend.post('/refresh', (req, res) => {
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

    spotifyApi
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


spotifyBackend.get("/lyrics", async (req, res) => {
    console.log('lyrics', req);
    const lyrics =
      (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
  })

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// API routes with authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token', token);
    if (!token) return res.status(401).json({ error: 'No token provided' });

    spotifyApi.setAccessToken(token);
    next();
};

// User methods
spotifyBackend.get('/me', authenticate, async (req, res) => {
    console.log('inside /me')
    try {
        const user = await spotifyApi.getMe();
        res.json(user.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Search methods
spotifyBackend.get('/search', authenticate, async (req, res) => {
    try {
        const { q, type = 'track' } = req.query;
        const results = await spotifyApi.search(q, type.split(','));
        res.json(results.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Playlist methods
spotifyBackend.get('/playlists', authenticate, async (req, res) => {
    try {
        const playlists = await spotifyApi.getUserPlaylists();
        res.json(playlists.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

spotifyBackend.post('/playlists', authenticate, async (req, res) => {
    try {
        const { name, description, public } = req.body;
        const playlist = await spotifyApi.createPlaylist(name, {
            description,
            public: public || false
        });
        res.json(playlist.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Player methods
spotifyBackend.get('/player', authenticate, async (req, res) => {
    try {
        const player = await spotifyApi.getMyCurrentPlaybackState();
        res.json(player.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

spotifyBackend.put('/player/play', authenticate, async (req, res) => {
    try {
        await spotifyApi.play();
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

spotifyBackend.put('/player/pause', authenticate, async (req, res) => {
    try {
        await spotifyApi.pause();
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Track methods
spotifyBackend.get('/tracks/:id', authenticate, async (req, res) => {
    try {
        const track = await spotifyApi.getTrack(req.params.id);
        res.json(track.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user's top items
spotifyBackend.get('/top/:type', authenticate, async (req, res) => {
    try {
        const { type } = req.params; // 'tracks' or 'artists'
        const { limit = 20, time_range = 'medium_term' } = req.query;

        let data;
        if (type === 'tracks') {
            data = await spotifyApi.getMyTopTracks({ limit, time_range });
        } else if (type === 'artists') {
            data = await spotifyApi.getMyTopArtists({ limit, time_range });
        }

        res.json(data.body);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = spotifyBackend;
