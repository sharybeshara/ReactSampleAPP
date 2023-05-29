import './App.css';
// import axios from 'axios';
import React from 'react';
import KidsTable from './components/kidsTable';
import KidView from './components/kidView';
import Login from './components/login/login';
import useToken from './useToken';

function App() {
  const { token, setToken, user, setUser, register, setRegister} = useToken();
  
  function logout(){
    setToken("");
    setUser({});
    setRegister(false);
  }

  return (
    <div>
      {!token &&  <Login setToken={setToken} register={register} setRegister={setRegister} setUser={setUser}/>} 
      {token && user && user.user_role ==="admin" && <KidsTable  logout={logout} />}
      {token && user && user.user_role ==="kid" && <KidView kid={user} logout={logout}/>}
    </div>
  );
}

export default App;
