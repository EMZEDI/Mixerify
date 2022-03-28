import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const queryString = require("query-string");

export const Auth = ({ setToken, spotifyApi }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let params = queryString.parse(window.location.hash);
    let token = params.access_token;
    // console.log(token);
    if (token) {
      setToken(token);
      spotifyApi.setAccessToken(token);
      navigate('/home')
    }
    setLoading(false);
  },[setToken, spotifyApi, navigate]);
  return(
    <div className="w-full h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex flex-col h-screen content-center justify-center text-center text-white">
      {loading ? "Loading" : "Auth failed, please try again."}
    </div>
  )
};

export default Auth;
