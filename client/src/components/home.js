import SpotifyWebApi from "spotify-web-api-js";
import { useState, useEffect } from "react";

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
          setImage(data.images[0].url)
          setName(data.display_name)
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
  <div>
        {user && (
        <div className="-mt-28">
        <div class="photo-wrapper p-2">
            <img className="w-32 h-32 rounded-full mx-auto" src={image}/>
        </div>
        <h2 className="text-center text-xl font-medium leading-8">{name}</h2>
        </div>
        )}
        {playlists && (
            <div>
            <h3 className="text-xl">Your Playlists:</h3>
                <div className="max-h-96 overflow-y-scroll">
                {playlists.items.map((p) => (
                    <div className="columns-2 p-2">
                    <img className="w-20 h-20" src={p.images[0].url} />
                    <div>
                    {p.name}<br/>
                    {p.id}
                    </div>
                    </div>
                ))}
                </div>
            </div>
        )}
  </div>
  );
};

export default Home;
