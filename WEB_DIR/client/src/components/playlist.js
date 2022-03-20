import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AudioButton from "./audio-button";
import spotify from "../Spotify_Logo_RGB_White.png";

export const Playlist = ({ spotifyApi }) => {
  const { id } = useParams();
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistD, setPlaylistD] = useState(null);
  useEffect(() => {
    spotifyApi.getPlaylistTracks(id).then(
      function (data) {
        // console.log(data);
        setPlaylistTracks(data);
        // console.log(playlist)
      },
      function (err) {
        console.error(err);
      }
    );
    spotifyApi.getPlaylist(id).then(
      function (data) {
        console.log(data);
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-xl bg-gray-700 text-white w-full min-h-screen">
        <div className="p-20 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 shadow-inner">
          <div className="space-y-2 mb-4 pl-4 container mx-auto">
            <Link className="text-emerald-400 mb-4 block text-xl" to="/home">
              &larr; Back Home
            </Link>
            <img className="w-44 py-4" src={spotify} />
            {playlistD && (
              <>
                <div className="flex items-center">
                  {playlistD.images.length > 0 && (
                    <img
                      className="w-60 h-60 mr-10 shadow-xl"
                      src={playlistD.images[0].url}
                    />
                  )}
                  <div className="space-y-2">
                    <h1 className="text-3xl">
                      Your playlist has been generated!
                    </h1>
                    <h2 className="text-5xl font-semibold">{playlistD.name}</h2>
                    <h4 className="text-2xl">{playlistD.description}</h4>
                    <h4 className="text-2xl pb-6">
                      {playlistD.tracks.total} songs
                    </h4>
                    <a
                      className="transition-all px-6 py-4 text-white bg-[#1DB954] rounded-full hover:bg-emerald-500"
                      href={playlistD.external_urls.spotify}
                      rel="noopener noreferrer"
                    >
                      PLAY ON SPOTIFY
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-black shadow-xl">
          <div className="container mx-auto">
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
              {playlistTracks &&
                playlistTracks.items.slice(0, 20).map((s) => (
                  <div
                    key={s.track.uri}
                    className="grid grid-cols-11 p-3 border-b-2 border-gray-600"
                  >
                    <div className="h-16 flex justify-center items-center">
                      <AudioButton
                        key={s.track.uri}
                        audio={s.track.preview_url}
                      />
                    </div>
                    <div className="h-16">
                      <img
                        className="w-16 h-16"
                        src={s.track.album.images[0].url}
                      />
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
            {playlistTracks && playlistTracks.items.length > 20 && (
              <div className="text-center p-8">
                <p className="text-center p-8 pt-3">
                  To see more songs, open on Spotify.
                </p>
                <a
                  className="transition-all px-6 py-4 text-white bg-[#1DB954] rounded-full hover:bg-emerald-500"
                  href={playlistD.external_urls.spotify}
                  rel="noopener noreferrer"
                >
                  OPEN ON SPOTIFY
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
