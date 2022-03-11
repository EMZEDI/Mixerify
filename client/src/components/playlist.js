import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const Playlist = ( { spotifyApi } ) => {
  const { id } = useParams();
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistD, setPlaylistD] = useState(null);
  useEffect(() => {
      spotifyApi
        .getPlaylistTracks(id)
        .then(
          function (data) {
            // console.log(data);
            setPlaylistTracks(data);
            // console.log(playlist)
          },
          function (err) {
            console.error(err);
          }
        );
        spotifyApi
        .getPlaylist(id)
        .then(
          function (data) {
            // console.log(data);
            setPlaylistD(data);
            // console.log(playlist)
          },
          function (err) {
            console.error(err);
          }
        );
  }, []);
//   console.log(playlist.items)
  return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex items-center justify-center">
  <div className="shadow-xl bg-gray-700 p-12 text-white w-full min-h-screen">
      <div className="ml-4 space-y-2 mb-4">
      {playlistD && (<>
      <h2 className="text-5xl">{playlistD.name}</h2>
      <h4 className="text-2xl">{playlistD.description}</h4>
    <h4 className="text-2xl">{playlistD.tracks.total} songs</h4>
        <p className="text-gray-500">{playlistD.id}</p></>)}
      <Link to='/home'>Back Home</Link>
      </div>
      <div>
      <div className="columns-3">
      {playlistTracks && playlistTracks.items.map((s) => (
                  <a key={s.track.uri} href={s.track.external_urls.spotify} className="p-4 flex items-center hover:bg-emerald-400 rounded-md transition-all cursor-pointer">
                    <img className="w-36 h-36 mr-8" src={s.track.album.images[0].url} />
                  <div>
                    <h3 className="text-2xl">{s.track.name}</h3>
                    <h4>{s.track.artists[0].name}</h4>
                  </div>
                </a>
        ))}
        </div>
        </div>
  </div>
  </div>);
};

export default Playlist;
