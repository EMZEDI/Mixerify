import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Home = ({ spotifyApi, user, setUser, playlists, setPlaylists, token }) => {
  const [response, setResponse] = useState("");
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  useEffect(() => {
    if (!user) {
      spotifyApi
        .getMe() // note that we don't pass a user id
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
    if (!playlists) {
      spotifyApi
        .getUserPlaylists() // note that we don't pass a user id
        .then(
          function (data) {
            // console.log(data.items);
            setPlaylists(data);
          },
          function (err) {
            console.error(err);
          }
        );
    }
  }, []);
  const request = () => {
    const data = { accessToken: token, playlist: "3J4cvaaBSToZAqTNenBvD7" };
    axios.post('http://localhost:8888/python', {}, { params: data })
      .then(response => {
        console.log(response);
        setResponse(response.data.output);
      });
  }

  return (
    <div className="w-full flex text-white">
      <div className="fixed w-1/2 h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex items-center justify-center">
        <div className="w-1/2">
          <div className="shadow-4xl bg-gray-700 font-semibold text-center rounded-3xl shadow-lg p-8 pt-16 relative">
            {user && <><div className="flex justify-center">
              <img
                className="shadow-lg w-32 h-32 rounded-full mx-auto mx-auto absolute -top-20"
                src={user.images[0].url}
              />
            </div>
            <h1 className="text-2xl">{user.display_name}</h1></>}
            {response}
            <a onClick={(()=>request())}>test me</a>
            <Link to="/" className="text-lg font-light text-gray-400">
              Log out
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2"></div>
      <div className="w-1/2 bg-gray-700 h-screen max-h-screen overflow-hidden">
        <h3 className="text-4xl p-16 pb-4 ml-2 font-semibold">
          Your Playlists:
        </h3>
        <div className="overflow-scroll h-full p-16 pt-0 pb-40">
          {playlists && (
            <div>
              <div>
                {playlists.items.map((p) => (
                  <Link key={p.id} to={`playlist/${p.id}`}>
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
