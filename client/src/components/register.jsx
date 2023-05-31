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
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Link from '@mui/material/Link';
import qrcode from '../qrcode.jpg'

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import './login/login.css';

export default function Register({ setToken, setUser, setRegister }) {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [kids, setKids] = useState([{ name: "", dateOfBirth: dayjs('2022-04-17') }]);

  const [admin, setAdmin] = useState(false);
  const addKid = () => {
    setKids([...kids, { name: "", dateOfBirth: dayjs('2022-04-17') }])
  };

  let handleChange = (value, i, name) => {
    let newKids = [...kids];
    newKids[i][name] = value;

    setKids(newKids);
  };

  async function registerUser(credentials) {
    return fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(response => {
      if (response.status === 409)
        setErrorMessage("This mobile number is already in use.")
      return response.json();
    })
      .then(data => data)
      .catch(error => {
        setError(true);
      });
  }

  const handleSubmit = async e => {
    e.preventDefault();


    let result = await registerUser({
      name,
      mobileNumber,
      password,
      adminPassword,
      email,
      address,
      kids
    });

    setToken(result?.token);
    setUser(result?.user);

  }

  return (
    <div className="login-wrapper">
      <Container component="main" maxWidth="xs">

        {error && <Alert severity="error" >{errorMessage}</Alert>}
        <Box
          component="form"
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >

          {/* <Typography component="h1" variant="h5"> */}
          <h2>Register</h2>
          {/* </Typography> */}
          {/* <Box sx={{ mt: 3 }}> */}
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                id="name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile"
                variant="outlined"
                fullWidth
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                id="password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          {!admin && <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            noValidate
            autoComplete="off">
            <Button onClick={addKid}>Add Kid</Button>
            <Grid container spacing={1} >
              {kids.map((kid, i) => {
                return (
                  <div key={i}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'TextField']}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="name"
                            fullWidth
                            label="Kid's Name"
                            onChange={(e) => handleChange(e.target.value, i, "name")}
                            value={kid.name || ""}
                            id="name"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            disableFuture={true}
                            label="Date Of Birth"
                            value={kid.dateOfBirth}
                            onChange={(date) => handleChange(date, i, "dateOfBirth")}
                          />
                        </Grid>
                        <Divider variant="middle" />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                );
              })}
            </Grid>
          </Box>}

          <FormGroup>
            <FormControlLabel control={<Switch
              checked={admin}
              onChange={(event) => setAdmin(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />} label="Servant" />
          </FormGroup>

          <Divider light />
          {admin &&
            <div>
              <Typography gutterBottom variant="body1">

              </Typography>

              <TextField
                helperText="Only enter the Servant Password if you are authorized as a servant."
                label="Servant Password"
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                error={error}
              />
            </div>
          }


          <div>

          </div>
          <Divider light />
          <Button sx={{ mt: 3, mb: 2 }} variant="outlined" type="submit" fullWidth>Register</Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setRegister(false)}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <Divider  />
          <h2>How to register</h2>
          <Typography component={'span'} variant={'body2'}>
            <p> <li>Registration Fee: $25 per child</li>
              <li>Duration: 10 weeks</li></p>
            <p></p>
            <p>  To complete the registration process, you can choose one of the following payment options:</p>

            <li>  Option 1: Scan Venmo QR Code</li>
            <ol>
              <li> Open the Venmo app on your smartphone.</li>
              <li> Select the "Scan" option.</li>
              <li> Align your phone's camera with the provided QR code.</li>
              <li> Enter the payment amount of $25 and proceed with the payment.</li>
            </ol>
            <p> <img src={qrcode} style={{ display: 'block', margin: 'auto', width: '250px', height: '300px' }} alt="react logo" /> </p>
            <li>Option 2: In-Person Payment</li>

            <p> If you prefer to make the payment in person, please contact Amy or Sara using the phone numbers provided below:</p>

            <li>  Amy Bishara: (925) 791-1098</li>
            <li>  Sara Magdy: (925) 393-8139</li>

            <p>  They will provide you with the necessary instructions for making the payment and completing the registration process.</p>

            <p> Should you have any further questions or need assistance, feel free to reach out to Amy or Sara.
            </p>
          </Typography>
        </Box>
      </Container >
    </div >



  )
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired
};