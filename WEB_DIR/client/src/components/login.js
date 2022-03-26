import { useState } from "react";

export const Login = () => {
  const [about, setAbout] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  return (
    <div className="w-full h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex flex-col h-screen content-center justify-center text-white">
    <div>
    <div className="w-1/2 bg-gray-700 m-auto p-10 rounded-xl shadow-2xl inner">
        <div className="p-2">
          <h1 className="font-medium text-5xl">Mixerify</h1>
        </div>
        <div className="p-2">
          {!about ? (<p>This web app will allow you to remix your Spotify playlists using our custom built AI. Simply log in with your Spotify account, click on one of your playlists, and we'll handle the rest!</p>) :
          (
            <div className="space-y-2">
              <p>This project takes advantage of Python machine learning. Backend was developed by Shahrad, Emma and Hanna.</p>
              <p>The front end is built in React.js with Tailwind with authentication and machine learning Python scripts run using a backend server built with Express. Front end and Express backend were built by Tristan.</p>
              <p>All code is available on the GitHub repo, linked below.</p>
            </div>
          )}
        </div>
        <div className="p-2">
          <a
            className="transition-all px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
            href={BACKEND_URL+"/login"}
            rel="noopener noreferrer"
          >
            Login
          </a>
          <span onClick={()=>setAbout(!about)} className="cursor-pointer transition-all px-6 py-2 ml-4 mt-4 text-white bg-cyan-500 rounded-lg hover:bg-cyan-400">
              {!about ? "About" : "Go Back"}
          </span>
        </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-md mb-3 text-gray-100">Built by Tristan, Shahrad, Emma and Hanna.</p>
      <a href="https://github.com/EMZEDI/MusicPlaylistGeneratorAIModel" className="text-5xl text-white hover:text-gray-600 transition-all"><i className="not-italic fa-brands fa-github"></i></a>
      </div>
      </div>
        </div>
  );
};

export default Login;
