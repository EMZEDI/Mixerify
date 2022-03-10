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
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/home" element={<Home token={token}/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
