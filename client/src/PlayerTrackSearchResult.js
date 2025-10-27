import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  console.log('player accessToken & trackUri ',{accessToken, trackUri})

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />


  )
}






export function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  )
}










  // const [search, setSearch] = useState("");
  // const [playingTrack, setPlayingTrack] = useState();
  // const [searchResults1, setSearchResults1] = useState([]);
  // const [lyrics, setLyrics] = useState("");







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
