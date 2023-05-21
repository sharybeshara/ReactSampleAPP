import './App.css';
// import axios from 'axios';
import React, { useState} from 'react';
import KidsTable from './components/kidsTable';
import Login from './components/login/login';
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken('');
  const [register, setRegister] = useState(false);

  const clickRegister = (registerValue) => {
    console.log(registerValue);
    setRegister(registerValue);
  };

  function logout(){
    console.log("here");
    setToken("");
    setRegister(false);
  }
 

  if(!token) {
    return <Login setToken={setToken} register={register} setRegister={clickRegister}/>
  }

  return (
    <div>
      <KidsTable  logout={logout} />
    </div>
  );
}

export default App;
