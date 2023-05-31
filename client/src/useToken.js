import { useEffect, useState } from 'react';

export default function useToken() {
  const getToken = () => {

    const tokenString = localStorage.getItem('token');
    try {
      const userToken = JSON.parse(tokenString);
      return userToken;
    }
    catch {
      return "";
    }

  };
  const [token, setToken] = useState(getToken());
  const [register, setRegister] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = () => {
      fetch(process.env.REACT_APP_BACKEND_HOST + '/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      }).then(response => response.json())
        .then(data => setUser(data));
    }
    if (token && token !== "" && !user) {
      getUser();
    }
  }, [token, user]);


  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };
  const saveUser = user => {
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