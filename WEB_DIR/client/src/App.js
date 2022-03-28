import Login from "./components/login";
import Home from "./components/home";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App-compiled.css";
import { useState, useEffect } from "react";
import Auth from "./components/auth";
import Playlist from "./components/playlist";
import SpotifyWebApi from "spotify-web-api-js";
import Generate from "./components/generate";
import PageNotFound from "./components/404";

function RequireAuth({ token, children }) {
  let location = useLocation();
  if (!token) {
    // Redirect to the /login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children
}

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  var spotifyApi = new SpotifyWebApi();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setUser={setUser}
              setToken={setToken}
              setPlaylists={setPlaylists}
              spotifyApi={spotifyApi}
            />
          }
        />
        <Route
          path="/auth"
          element={<Auth setToken={setToken} spotifyApi={spotifyApi} />}
        />
        <Route
          path="/home"
          element={
            <RequireAuth token={token}>
              <Home
                user={user}
                setUser={setUser}
                playlists={playlists}
                setPlaylists={setPlaylists}
                spotifyApi={spotifyApi}
                token={token}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/home/playlist/:id"
          element={
            <RequireAuth token={token}>
              <Playlist spotifyApi={spotifyApi} />
            </RequireAuth>
          }
        />
        <Route
          path="/home/generate/:id"
          element={
            <RequireAuth token={token}>
              <Generate spotifyApi={spotifyApi} token={token} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
