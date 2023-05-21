import './App.css';
// import axios from 'axios';
import React, { useState, useEffect} from 'react';
import KidsTable from './components/kidsTable';
import Login from './components/login/login';
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken();
  const [kids, setKids] = useState([]);
  const [register, setRegister] = useState(false);

  const clickRegister = (registerValue) => {
    console.log(registerValue);
    setRegister(registerValue);
  };
 
  useEffect(() => {
    getKids();
  }, []);

  function getKids() {
    fetch('http://localhost:8080/kids')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        setKids(data);
      });
  }



  if(!token) {
    return <Login setToken={setToken} register={register} setRegister={clickRegister}/>
  }

  return (
    <div>
      <KidsTable data={kids} />
    </div>
  );
}

export default App;
