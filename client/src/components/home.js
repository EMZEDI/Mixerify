import SpotifyWebApi from "spotify-web-api-js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Home = ({ token }) => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  var spotifyApi = new SpotifyWebApi();
  useEffect(() => {
    spotifyApi.setAccessToken(token);
    spotifyApi
      .getMe() // note that we don't pass a user id
      .then(
        function (data) {
          setUser(data);
          console.log(data);
          setImage(data.images[0].url);
          setName(data.display_name);
        },
        function (err) {
          console.error(err);
        }
      );
    spotifyApi
      .getUserPlaylists() // note that we don't pass a user id
      .then(
        function (data) {
          setPlaylists(data);
          console.log(data.items);
        },
        function (err) {
          console.error(err);
        }
      );
  }, []);
  return (
    <div className="w-full flex text-white">
      <div className="fixed w-1/2 h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex items-center justify-center">
        <div className="w-1/2">
          <div className="shadow-4xl bg-gray-700 font-semibold text-center rounded-3xl shadow-lg p-8 pt-16 relative">
            <div className="flex justify-center">
              <img
                className="shadow-lg w-32 h-32 rounded-full mx-auto mx-auto absolute -top-20"
                src={image}
              />
            </div>
            <h1 className="text-2xl">{name}</h1>
            <Link to="/" className="text-lg font-light text-gray-400">
              Log out
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2"></div>
      <div className="w-1/2 bg-gray-700 h-screen max-h-screen overflow-hidden">
        <h3 className="text-4xl p-16 pb-4 ml-2 font-semibold">Your Playlists:</h3>
        <div className="overflow-scroll h-full p-16 pt-0 pb-40">
          {playlists && (
            <div>
              <div>
                {playlists.items.map((p) => (
                  <div className="p-4 flex items-center hover:bg-emerald-400 rounded-md transition-all cursor-pointer">
                    <img className="w-36 h-36" src={p.images[0].url} />
                    <div className="ml-8">
                      <h3 className="text-3xl">{p.name}</h3>
                      <h4>{p.description}</h4>
                      <h4>{p.tracks.total} songs</h4>
                      <p className="text-gray-500">{p.id}</p>
                    </div>
                  </div>
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
