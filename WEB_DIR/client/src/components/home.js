import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import spotify from "../Spotify_Logo_RGB_White.png"

export const Home = ({
  spotifyApi,
  user,
  setUser,
  playlists,
  setPlaylists,
  token,
}) => {
  useEffect(() => {
    if (!user) {
      spotifyApi
        .getMe()
        .then(
          function (data) {
            setUser(data);
            // console.log(data);
          },
          function (err) {
            console.error(err);
          }
        );
    }
    spotifyApi
      .getUserPlaylists()
      .then(
        function (data) {
          // console.log(data.items);
          setPlaylists(data);
        },
        function (err) {
          console.error(err);
        }
      );
  }, []);

  return (
    <div className="w-full flex text-white">
      <div className="md:fixed md:w-1/2 h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex items-center justify-center">
        <div className="md:w-1/2">
          <div className="shadow-4xl bg-gray-700 font-semibold text-center rounded-3xl shadow-lg p-8 pt-16 relative">
            {user && (
              <>
                <div className="flex justify-center">
                  <img
                    className="shadow-lg w-32 h-32 rounded-full mx-auto mx-auto absolute -top-20"
                    src={user.images.length>0 && user.images[0].url}
                  />
                </div>
                <h1 className="text-2xl">{user.display_name}</h1>
              </>
            )}
            {/* <a onClick={(()=>request())}>test me</a> */}
            <Link to="/" className="text-lg font-light text-gray-400">
              Log out
            </Link>
          </div>
        </div>
      </div>
      <div className="invisible md:visible w-1/2"></div>
      <div className="w-1/2 bg-gray-700 h-screen max-h-screen overflow-hidden">
      <img className="w-80 p-20 pl-16 pb-2" src={spotify} />
        <h3 className="text-4xl p-16 pt-0 pb-4 ml-2 font-semibold">
          Select a playlist to remix:
        </h3>
        <div className="overflow-scroll h-full p-16 pt-0 pb-48">
          {playlists && (
            <div>
              <div>
                {playlists.items.map((p) => (
                  <Link key={p.id} to={`generate/${p.id}`}>
                    <div className="p-4 flex items-center hover:bg-emerald-400 rounded-md transition-all cursor-pointer">
                      {p.images.length > 0 && (
                        <img className="w-36 h-36 mr-8" src={p.images[0].url} />
                      )}
                      <div>
                        <h3 className="text-3xl">{p.name}</h3>
                        <h4>{p.description}</h4>
                        <h4>{p.tracks.total} songs</h4>
                        <p className="text-gray-500">{p.id}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
