import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import './login.css';

export default function Login({ setToken, setRegister, setUser }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reset, setReset] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [passwordError, setPasswordError] = useState(false);

  function loginUser(credentials) {
    fetch(process.env.REACT_APP_BACKEND_HOST + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(response => {
      if (response.status >= 400) {
        throw new Error("Invalid Mobile Number or Password. Please try again.");
      }
      return response.json();
    }).then(data => {
      setToken(data.token);
      setUser(data.user);
    }).catch(error => {
      setError(true);
      setErrorMessage(error.message);
    })
  }

  function resetPassword(credentials) {
    fetch(process.env.REACT_APP_BACKEND_HOST + '/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(response => {
      if (response.status >= 400) {
        throw new Error("Invalid Mobile Number or Email. Please try again.");
      }
      return response.json();
    }).then(data => {
      setToken(data.token);
      setUser(data.user);
    }).catch(error => {
      setError(true);
      setErrorMessage(error.message);
    });
  }

  const handleSubmit = e => {
      e.preventDefault();
      if (!reset) {
        loginUser({
          mobileNumber,
          password
        });
      }
      else {
        if (confirmPassword !== newPassword) {
          setError(true);
          setPasswordError(true);
          setErrorMessage("The passwords you entered do not match.");
        }
        else {
          setError(false);
          setPasswordError(false);
          setErrorMessage("");
          resetPassword({ mobile: mobileNumber, email: email, password: newPassword });
        }
      }
    }

    return (
      <div className="login-wrapper">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <h2>{reset ? "Reset Password" : "Login"}</h2>

          <div>
            <TextField
              label="Mobile"
              type="tel"
              id="mobile_number"
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              required
              error={error}
            />
          </div>
          <div>
            {!reset && <TextField
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              error={error}
            />}
          </div>
          {reset && <div>
            <TextField
              label="Email"
              type="email"
              id="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
              error={error}
            />
          </div>}
          {reset && <TextField
            label="New Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            error={passwordError}
          />}
          {reset && <TextField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            error={passwordError}
          />}

          <Grid item><Button type="submit">{reset ? "Reset" : "Login"}</Button></Grid>
          {!reset &&
            <Grid item><Button variant="text" onClick={() => setRegister(true)}>register</Button> </Grid>
          }

          <div>
            <Snackbar open={error} autoHideDuration={6000} >
              <Alert severity="error" sx={{ width: '100%' }}>
                {errorMessage}
              </Alert>
            </Snackbar>

          </div>
          {!reset && <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setReset(true)}>
                Forgot your password?
              </Link>
            </Grid>
          </Grid>}
        </Box>
      </div>
    )
  }

  Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };