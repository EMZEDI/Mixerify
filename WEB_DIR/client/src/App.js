import logo from "./logo.svg";
import "./App.css";
import Index from "./components";
import Home from "./components/home";
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './App-compiled.css';
import { useState, useEffect } from "react";
import Auth from "./components/auth";
import Playlist from "./components/playlist";
import SpotifyWebApi from "spotify-web-api-js";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  var spotifyApi = new SpotifyWebApi();
  return (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index setUser={setUser} setToken={setToken} setPlaylists={setPlaylists} spotifyApi={spotifyApi}/>}/>
          <Route path="/auth" element={<Auth setToken={setToken} spotifyApi={spotifyApi}/>}/>
          <Route path="/home" element={<Home user={user} setUser={setUser} playlists={playlists} setPlaylists={setPlaylists} spotifyApi={spotifyApi} token={token}/>} />
          <Route path="/home/playlist/:id" element={<Playlist spotifyApi={spotifyApi}/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
