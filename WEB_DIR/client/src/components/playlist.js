import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AudioButton from "./audio-button";

export const Playlist = ( { spotifyApi } ) => {
  const { id } = useParams();
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistD, setPlaylistD] = useState(null);
  useEffect(() => {
      spotifyApi
        .getPlaylistTracks(id)
        .then(
          function (data) {
            console.log(data);
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
      <Link className="text-emerald-400 mb-4 block text-xl" to='/home'>&larr; Back Home</Link>
      <h1 className="text-4xl py-4">Your playlist has been generated!</h1>
      {playlistD && (<>
      <div className="flex items-center">
        {playlistD.images.length > 0 && (
                        <img className="w-48 h-48 mr-10" src={playlistD.images[0].url} />
                      )}
      <div>
      <h2 className="text-5xl">{playlistD.name}</h2>
      <h4 className="text-2xl">{playlistD.description}</h4>
    <h4 className="text-2xl">{playlistD.tracks.total} songs</h4>
        <p className="text-gray-500">{playlistD.id}</p>
        </div>
        </div></>
        )}
      </div>
      <div>
        <div>
        <div className="grid grid-cols-11 p-4 border-b-4 border-gray-600">
                    <div className="col-span-2"></div>
                    <div className="ml-8 flex flex-col justify-center col-span-5">
                    <h3 className="text-2xl">Song</h3>
                    </div>
                    <div className=" flex flex-col justify-center col-span-4">
                    <h4 className="text-2xl">Artist</h4>
                    </div>
                </div>
        </div>
      <div>
      {playlistTracks && playlistTracks.items.map((s) => (
                  <div key={s.track.uri} className="grid grid-cols-11 p-3 border-b-2 border-gray-600">
                    <div className="h-16 flex justify-center items-center">
                    <AudioButton key={s.track.uri} audio={s.track.preview_url}/>
                    </div>
                    <div className="h-16">
                    <img className="w-16 h-16" src={s.track.album.images[0].url} />
                    </div>
                    <div className="ml-8 h-16 flex flex-col justify-center col-span-5">
                    <h3 className="text-1xl">{s.track.name}</h3>
                    </div>
                    <div className="h-16 flex flex-col justify-center col-span-4">
                    <h4 className="text-1xl">{s.track.artists[0].name}</h4>
                    </div>
                </div>
        ))}
        </div>
        </div>
  </div>
  </div>);
};

export default Playlist;
