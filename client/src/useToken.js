import { useState } from 'react';

export default function useToken() {
  const getToken = () => {

    const tokenString = localStorage.getItem('token');
    
    const userToken = JSON.parse(tokenString);

    return userToken;
  };

  const getUser = () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    return user;
  };
  const [token, setToken] = useState(getToken());
  const [register, setRegister] = useState(false);
  const [user, setUser ] = useState(getUser());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    console.log(userToken);
    setToken(userToken);
  };
  const saveUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
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