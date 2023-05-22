import { useState } from 'react';

export default function useToken() {
  const getToken = () => {

    const tokenString = localStorage.getItem('token');   
    try{
      const userToken = JSON.parse(tokenString);
      return userToken;
    }
    catch{
      return "";
    }
    
  };

  const getUser = () => {
    const userString = localStorage.getItem('user');
    try{
      const user = JSON.parse(userString);
      return user;
    }
    catch{
      return {};
    }
  };
  const [token, setToken] = useState(getToken());
  const [register, setRegister] = useState(false);
  const [user, setUser ] = useState(getUser());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };
  const saveUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  return {
    setToken: saveToken,
    token,
    user,
    setUser: saveUser,
    register,
    setRegister
  }
}