import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './login.css';

async function loginUser(credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }
 async function registerUser(credentials) {
  return fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }
export default function Login({ setToken, register, setRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [adminPassword, setAdminPassword] = useState();
  
  const handleSubmit = async e => {
    e.preventDefault();
    let token = null; 
    if (!register) {
    token = await loginUser({
      email,
      password
    });}
    else{
     token = await registerUser({
      name,  
      email,
      password,
      adminPassword
      });
    }

    setToken(token);
  }

  return(
    <div className="login-wrapper">
     {!register && <h2>Login</h2>}
     {register && <h2>Register</h2>}
      <form onSubmit={handleSubmit}>
      {register &&
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {register &&
        <div>
          <label htmlFor="password">Enter Admin Password if you are an admin:</label>
          <input
            type="password"
            id="adminPassword"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
          />
        </div>}
        {!register && <button type="submit">Login</button> }
        {register &&<button type="submit">Register</button>} 
        {!register && <a  onClick={() => setRegister(true)}>register</a>}
        <div>
          
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};