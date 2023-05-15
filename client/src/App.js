import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect} from 'react'

function App() {
  const [data, setData] = useState([]);
  
useEffect(() => {
  async function fetchData() {
    const url = "/server";

          const res = await axios(url);
          console.log("Health status from backend---",res.data);
    setData(res.data);
  }

  fetchData();
}, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          {data}
        </a>

      </header>
    </div>
  );
}

export default App;
