import './App.css';
// import axios from 'axios';
import React, { useState, useEffect} from 'react';
import KidsTable from './kidsTable';


function App() {
  const [kids, setKids] = useState([]);
  
useEffect(() => {
  getKids();
}, []);

function getKids() {
  fetch('http://localhost:8080/kids')
    .then(response => {
      return response.json();
    })
    .then(data => {
      setKids(data);
    });
}


  return (
    <div>
      <KidsTable data={kids} />
    </div>
  );
}

export default App;
