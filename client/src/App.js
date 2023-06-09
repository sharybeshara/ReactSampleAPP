import './App.css';
// import axios from 'axios';
import React from 'react';
import KidsTable from './components/kidsTable';
import Login from './components/login/login';
import useToken from './useToken';
import Register from './components/register';
import ParentView from './components/parentView';

function App() {
  const { token, setToken, user, setUser, register, setRegister} = useToken();
  
  function logout(){
    setToken("");
    setUser({});
    setRegister(false);
  }

  return (
    <div>
      {!token && !register && <Login setToken={setToken} register={register} setRegister={setRegister} setUser={setUser}/>} 
      {!token && register && <Register setToken={setToken} setUser={setUser} setRegister={setRegister}/>} 
      {token && user && user.user_role ==="superAdmin" &&  <KidsTable  logout={logout} role={"super"} />}
      {token && user && user.user_role ==="admin" &&  <KidsTable  logout={logout} role={"admin"} />}
      {token && user && user.user_role ==="parent" && <ParentView propParent={user} logout={logout}/>}
      {token && user && user.user_role !=="parent" && user.user_role !=="admin" && user.user_role !=="superAdmin" && <Register setToken={setToken} setUser={setUser}/>}
    </div>
  );
}

export default App;
