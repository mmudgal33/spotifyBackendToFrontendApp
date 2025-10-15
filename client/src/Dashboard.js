import { useState, useEffect } from "react"
import useAuth from "./useAuth"

// import Player from "./Player"
// import TrackSearchResult from "./TrackSearchResult"
// import axios from "axios"

import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"


import { spotifyService } from './SpotifyService';

// http://127.0.0.1:5000


const spotifyApi = new SpotifyWebApi({
  // clientId: "8b945ef10ea24755b83ac50cede405a0",
  // clientId: '48d88eedb5cc4667b1b08a7b9eb933df',
  clientId: "e257dc917f8640b5a9afe2f6e6ac1ef9",

})

export default function Dashboard({ code }) {

  console.log('Dashboard code ', code);

  const accessToken = useAuth(code);
  
  // const [search, setSearch] = useState("");
  // const [playingTrack, setPlayingTrack] = useState();
  // const [searchResults1, setSearchResults1] = useState([]);
  // const [lyrics, setLyrics] = useState("");
  


  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  

  console.log('Dashboard Token ', accessToken);
  console.log('localStorage ', localStorage.getItem('spotify_access_token'))


  // setting access token
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  // function called from Form component
  // function chooseTrack(track) {
  //   setPlayingTrack(track)
  //   setSearch("")
  //   setLyrics("")
  // }


  // use 'lyrics-finder' library to get lyrics
  // useEffect(() => {
  //   if (!playingTrack) return

  //   axios
  //     .get("http://127.0.0.1:5000/lyrics", {
  //       params: {
  //         track: playingTrack.title,
  //         artist: playingTrack.artist,
  //       },
  //     })
  //     .then(res => {
  //       setLyrics(res.data.lyrics)
  //     })
  // }, [playingTrack])



  // track.album.images[2]?.url
  // get results from search form using this useEffect
  // useEffect(() => {
  //   if (!search) return setSearchResults1([])
  //   if (!accessToken) return

  //   let cancel = false
  //   spotifyApi.searchTracks(search).then(res => {
  //     // console.log('cancel ',cancel);
  //     if (cancel) return
  //     // console.log('track response', res);
  //     // setSearchResults(results.tracks.items);
  //     setSearchResults1(
  //       res.body.tracks.items.map(track => {
  //         const smallestAlbumImage = track.album.images.reduce(
  //           (smallest, image) => {
  //             if (image.height < smallest.height) return image
  //             return smallest
  //           },
  //           track.album.images[0]
  //         )

  //         return {
  //           artist: track.artists[0].name,
  //           title: track.name,
  //           uri: track.uri,
  //           albumUrl: smallestAlbumImage.url,
  //         }
  //       })
  //     )

  //   })

  //   return () => (cancel = true)
  // }, [search, accessToken])



  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log('Dashboard code ', code);
  console.log('Dashboard Token ', accessToken);

  console.log('playlists ', playlists);
  console.log('topTracks ', topTracks);
  console.log('user ', user);

  

  // call loadUserData function 
  useEffect(() => {
    loadUserData();
  }, []);
  

  const loadUserData = async () => {
    try {
      const [userData, playlistsData, topTracksData] = await Promise.all([
        spotifyService.getCurrentUser(),
        spotifyService.getUserPlaylists(),
        spotifyService.getTopTracks(10)
      ]);

      setUser(userData);
      setPlaylists(playlistsData.items);
      setTopTracks(topTracksData.items);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const results = await spotifyService.search(searchQuery, ['track', 'artist']);
      setSearchResults2(results.tracks.items);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      const playbackState = await spotifyService.getPlaybackState();

      if (playbackState.is_playing) {
        await spotifyService.pause();
      } else {
        await spotifyService.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };



  if (!user) {
    return <div>Loading...</div>;
  }

  

  

  /////////////////////////////////////////////////////////////////////////////////////////////




  return (
    <>
      <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>


        <div className="dashboard">
          <header>
            <h1>Welcome, {user.display_name}</h1>
            <img src={user.images?.[0]?.url} alt="Profile" className="profile-img" />
          </header>



          <div className="sections">
            {/* <div className="flex-grow-1 my-2"> */}
            <section>
              <h2>Your Top Tracks</h2>
              <div className="tracks-grid">
                {topTracks.map(track => (
                  <div key={track.id} className="track-card">
                    <img src={track.album.images[1]?.url} alt={track.name} />
                    <h5>{track.name.slice(0, 25)}</h5>
                    <p>{track.artists[0].name}</p>
                    <button onClick={handlePlayPause}>Play</button>
                  </div>
                ))}
              </div>
            </section>

            <hr /><hr /><hr /><hr />

            <section>
              <h2>Your Playlists</h2>
              <div className="playlists-grid">
                {playlists.map(playlist => (
                  <div key={playlist.id} className="playlist-card">
                    {/* <img src={playlist.images[0]?.url} alt={playlist.name} /> */}
                    <img src={playlist.images?.[0]?.url} alt={playlist.name} />
                    <h4>{playlist.name}</h4>
                    <p>{playlist.tracks.total} tracks</p>
                    <button onClick={handlePlayPause}>Play</button>
                  </div>
                ))}
              </div>
            </section>




            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tracks, artists..."
              />
              <button type="submit">Search</button>
            </form>

            

            {searchResults2.length > 0 && (
              <section>
                <h2>Search Results</h2>
                <div className="search-results">
                  {searchResults2.map(track => (
                    <div key={track.id} className="track-item">
                      <img src={track.album.images?.[2]?.url} alt={track.name} />
                      <div>
                        <h4>{track.name}</h4>
                        <p>{track.artists[0].name}</p>
                      </div>
                      <button onClick={handlePlayPause}>Play</button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>





        {/* <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
            {searchResults1.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}
            {searchResults1.length === 0 && (
              <div className="text-center" style={{ whiteSpace: "pre" }}>
                {lyrics}
              </div>


            )}
          </div>
          <div>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
          </div> */}


      </Container>










    </>
  )
}
























//   useEffect(() => {
//     if (!playingTrack) return

//     axios
//       .get("http://127.0.0.1:5000/dmain", {
//         params: {
//           name: 'mohit',
//           email: 'mmudgal33@gmail.com',
//         },
//       })
//       .then(res => {
//         setData(res);
//         console.log('response', res);

//       })
//   }, [playingTrack])

//  console.log('data', data)




  // useEffect(() => {
  //   console.log('useAuth ', code)
  //   axios
  //     .get("http://127.0.0.1:5000/login",
  //       {code,}
  //     )
  //     .then(res => {
  //       setAccessToken(res.data.accessToken)
  //       setRefreshToken(res.data.refreshToken)
  //       setExpiresIn(res.data.expiresIn)
  //       window.history.pushState({}, null, "/")
  //     })
  //     .catch(() => {
  //       window.location = "/"
  //     })
  // }, [code])