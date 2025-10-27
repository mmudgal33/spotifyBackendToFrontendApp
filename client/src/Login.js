import React from "react"
import { Container } from "react-bootstrap"

import { config } from './Constants';
const URL = config.url;

// const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
// const AUTH_URL = 
// `https://accounts.spotify.com/authorize?client_id=e257dc917f8640b5a9afe2f6e6ac1ef9&response_type=code&redirect_uri=https://spotifybackendtofrontendapp-1.onrender.com/callback&scope=user-library-read user-read-playback-state playlist-read-collaborative playlist-read-private user-modify-playback-state user-read-private user-read-email streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify`;


const AUTH_URL = 
  `https://accounts.spotify.com/authorize?client_id=e257dc917f8640b5a9afe2f6e6ac1ef9&response_type=code&redirect_uri=${URL}/callback&scope=user-library-read user-read-playback-state playlist-read-collaborative playlist-read-private user-modify-playback-state user-read-private user-read-email streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify`;

// const AUTH_URL = 
// `https://accounts.spotify.com/authorize?client_id=e257dc917f8640b5a9afe2f6e6ac1ef9&response_type=code&redirect_uri=http://127.0.0.1:3000/callback&scope=user-library-read user-read-playback-state playlist-read-collaborative playlist-read-private user-modify-playback-state user-read-private user-read-email streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify`;

// const AUTH_URL =
//   // "https://accounts.spotify.com/authorize?client_id=8b945ef10ea24755b83ac50cede405a0&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
//   "https://accounts.spotify.com/authorize?client_id=8b945ef10ea24755b83ac50cede405a0&response_type=code&redirect_uri=http://localhost:3000&scope=user-library-read user-read-playback-state playlist-read-collaborative playlist-read-private user-modify-playback-state user-read-private user-read-email streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify"
//   // "https://accounts.spotify.com/authorize?client_id=48d88eedb5cc4667b1b08a7b9eb933df&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-library-read user-read-playback-state playlist-read-collaborative playlist-read-private user-modify-playback-state user-read-private user-read-email streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify"

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
