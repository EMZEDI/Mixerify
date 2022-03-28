import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import spotify from "../Spotify_Logo_RGB_White.png";

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
      spotifyApi.getMe().then(
        function (data) {
          setUser(data);
          // console.log(data);
        },
        function (err) {
          console.error(err);
        }
      );
    }
    spotifyApi.getUserPlaylists().then(
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
    <div className="w-full md:flex text-white">
      <div className="md:fixed md:w-1/2 md:h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 md:flex md:items-center md:justify-center">
        <div className="md:w-3/4 xl:w-1/2">
          <div className="bg-gray-700 font-semibold text-center md:rounded-3xl md:shadow-lg md:p-8 pt-4 md:pt-16 relative space-y-4 md:space-y-0">
            {user && (
              <>
                <div className="flex justify-center">
                  <img
                    className="shadow-lg h-16 h-16 md:w-32 md:h-32 rounded-full mx-auto mx-auto md:absolute md:-top-20"
                    src={user.images.length > 0 && user.images[0].url}
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
      <div className="p-4 md:p-0 md:w-1/2 bg-gray-700 md:h-screen md:max-h-screen md:overflow-hidden">
        <img className="w-32 ml-2 mb-2 md:md-0 md:ml-0 md:w-60 xl:w-80 md:p-10 xl:p-20 md:pl-8 xl:pl-16 xl:pb-2 md:pb-2" src={spotify} />
        <h3 className="text-xl md: text-2xl lg:text-4xl md:p-8 xl:p-16 md:pt-0 md:pb-4 ml-2 xl:py-2 font-semibold">
          Select a playlist to remix:
        </h3>
        <div className="md:overflow-scroll md:h-full md:p-6 xl:p-16 md:pt-0 xl:pt-0 md:pb-48 xl:pb-48">
          {playlists && (
            <div>
              <div>
                {playlists.items.map((p) => (
                  <Link key={p.id} to={`generate/${p.id}`}>
                    <div className="p-2 md:p-4 flex items-center hover:bg-emerald-400 rounded-md transition-all cursor-pointer">
                      {p.images.length > 0 && (
                        <img className="w-16 h-16 md:w-24 md:h-24 lg:w-36 lg:h-36 mr-3 lg:mr-8" src={p.images[0].url} />
                      )}
                      <div>
                        <h3 className="text-lg md:text-3xl">{p.name}</h3>
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
