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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   console.log(playlist.items)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-xl bg-gray-700 text-white w-full min-h-screen">
        <div className="md:p-20 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 shadow-inner">
          <div className="space-y-2 pb-4 pl-4 container mx-auto">
            <Link className="text-emerald-400 md:pt-0 pt-2 md:mb-4 block md:text-xl" to="/home">
              &larr; Back Home
            </Link>
            <img alt="Spotify" className="md:w-44 w-28 py-4" src={spotify} />
            {playlistD && (
              <>
                <div className="flex items-center">
                  {playlistD.images.length > 0 && (
                    <img
                    alt="Playlist Art"  
                    className="w-28 h-28 md:w-60 md:h-60 mr-10 shadow-xl"
                      src={playlistD.images[0].url}
                    />
                  )}
                  <div className="space-y-2">
                    <h1 className="md:text-3xl">
                      Your playlist has been generated!
                    </h1>
                    <h2 className="md:text-5xl font-semibold">{playlistD.name}</h2>
                    <h4 className="md:text-2xl">{playlistD.description}</h4>
                    <h4 className="md:text-2xl pb-6">
                      {playlistD.tracks.total} songs
                    </h4>
                    <a
                      className="text-sm transition-all px-3 md:px-6 py-2 md:py-4 text-white bg-[#1DB954] rounded-full hover:bg-emerald-500"
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
              <div className="grid grid-cols-11 p-2 md:p-4 border-b-4 border-gray-600">
                <div className="col-span-2"></div>
                <div className="ml-8 flex flex-col justify-center col-span-5">
                  <h3 className="md:text-2xl">Song</h3>
                </div>
                <div className=" flex flex-col justify-center col-span-4">
                  <h4 className="md:text-2xl">Artist</h4>
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
                    <div className="invisible md:visible md:h-16 flex justify-center items-center">
                      <AudioButton
                        key={s.track.uri}
                        audio={s.track.preview_url}
                      />
                    </div>
                    <div className="-ml-6 md:ml-0 h-16 w-16">
                      <img
                        alt="Album Art"
                        className="w-16 h-16"
                        src={s.track.album.images[0].url}
                      />
                    </div>
                    <div className="ml-8 h-16 flex flex-col justify-center col-span-5">
                      <h3 className="md:text-1xl">{s.track.name}</h3>
                    </div>
                    <div className="h-16 flex flex-col justify-center col-span-4">
                      <h4 className="md:text-1xl">{s.track.artists[0].name}</h4>
                    </div>
                  </div>
                ))}
            </div>
            {playlistD && playlistTracks && playlistTracks.items.length > 20 && (
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
