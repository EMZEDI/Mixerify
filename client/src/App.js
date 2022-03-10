import logo from "./logo.svg";
import "./App.css";
import Index from "./components";
import Home from "./components/home";
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './App-compiled.css';

const queryString = require("query-string");

function App() {
  let params = queryString.parse(window.location.hash);
  let token = params.access_token;
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-700 to-emerald-400 flex flex-col h-screen content-center justify-center text-white">
      <div className="w-1/2 bg-gray-700 m-auto p-10 rounded-xl shadow-2xl inner">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/home" element={<Home token={token}/>} />
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
