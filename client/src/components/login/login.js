import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Alert from '@mui/material/Alert';
import './login.css';

export default function Login({ setToken, register, setRegister, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [adminPassword, setAdminPassword] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const [emailError, setEmailError] = useState(false)
  // const [passwordError, setPasswordError] = useState(false)
  const [admin, setAdmin] = useState(false);

   function loginUser(credentials) {
    return fetch('https://server-dot-storied-galaxy-386808.wl.r.appspot.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(data => data.json())
      .catch(error => {
          setError(true);
          setErrorMessage(error.toString()+"at login");
      });
   }
   async function registerUser(credentials) {
    return fetch('https://server-dot-storied-galaxy-386808.wl.r.appspot.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(data => data.json())
          .catch(error => {
            setError(true);
          }); 
   }

  const handleSubmit = async e => {
    e.preventDefault();
    // setEmailError(false)
    // setPasswordError(false)
   
    let result = null; 
    if (!register) {
    result = await  loginUser({
      email,
      password
    });
  }
    else{
      result = await registerUser({
      name,  
      email,
      password,
      adminPassword
      });
    }
    // if(result){
    //   console.log(result);
    //   token = result.token;
    //   user = result.user;

      
    // }
    setToken(result?.token);
    setUser(result?.user);
      
  }

  return(
    <div className="login-wrapper">
    {error &&  <Alert severity="error" >{errorMessage}</Alert>}
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
     {!register && <h2>Login</h2>}
     {register && <h2>Register</h2>}
      {/* <form onSubmit={handleSubmit}> */}
        <div>
        <TextField
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          error={error}
        />
        </div>
        <div>
        {register &&
          <TextField
            label="Name"
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={error}
          />
        }
        </div>
        <div>
        <TextField
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          error={error}
        />
        </div>
        <div>
        {register &&
        <FormGroup>
        <FormControlLabel control={<Switch
          checked={admin}
          onChange={(event) => setAdmin(event.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        /> }label="Admin" />
       </FormGroup>
        }
        <Divider light />
        {register && admin &&
        <div>
          <Typography gutterBottom variant="body1">
         
        </Typography>
          
          <TextField
          helperText =  "Only enter the Admin Password if you are authorized as an administrator."
          label="Admin Password"  
          type="password"
            id="adminPassword"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            error={error}
          />
        </div>}
        </div>
        {!register && <Button  type="submit">Login</Button> }
        {register && <Button variant="outlined" type="submit">Register</Button>} 
        {!register && <Button variant="text" onClick={() => setRegister(true)}>register</Button>}
        <div>
          
        </div>
      {/* </form> */}
   </Box>
   </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};