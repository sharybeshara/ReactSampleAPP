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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';


import './login/login.css';

export default function Register({ setToken, setUser, setRegister }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState();
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [mobError, setMobError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentOption, setPaymentOption] = useState();
  const [kids, setKids] = useState([{ first_name: "", last_name: "", dateOfBirth: dayjs('2022-04-17') }]);
  const [admin, setAdmin] = useState(false);

  const addKid = () => {
    setKids([...kids, { first_name: "", last_name: "", dateOfBirth: dayjs('2022-04-17') }])
  };

  let handleChange = (value, i, name) => {
    let newKids = [...kids];
    newKids[i][name] = value;

    setKids(newKids);
  };
  const handlePaymentChange = (event) => {
    setPaymentOption(event.target.value);
  };

  function registerUser(credentials) {
    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(response => {
      if (response.status >= 400) {
        setError(true);
        setMobError(false);
        if (response.status === 409) {
          setMobError(true);
          throw new Error("This mobile number is already in use.");
        }
        if (response.status === 401) {
          setAdminPasswordError(true);
          throw new Error("Sorry, the servant password you entered is incorrect.");
        }
        if (response.status === 402)
          throw new Error("Please select your preferred payment method");
        if (response.status === 400)
          throw new Error("Please fill all the required fields");
      if (response.status === 418)
          throw new Error("Please add your kid/s info.");
        }
      return response.json();
    })
      .then(data => {
        setToken(data.token);
        setUser(data.user);
      }).catch(error => {
        setError(true);
        setErrorMessage(error.message);
      });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (confirmPassword !== password) {
      setError(true);
      setPasswordError(true);
      setErrorMessage("The passwords you entered do not match.");
    }
    else {
      setError(false);
      setPasswordError(false);
      setErrorMessage("");
      registerUser({
        firstName,
        lastName,
        mobileNumber,
        password,
        adminPassword,
        email,
        address,
        kids,
        paymentOption,
        admin
      });
    }

  }

  return (
    <div className="login-wrapper">
      <Container component="main" maxWidth="xs">
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
          <h1>Summer Club 2023</h1>
          {!admin && <Typography component={'span'} variant={'body2'}>
            <p> <li>Registration Fee: $25 per child</li>
              <li>Duration: 10 weeks</li></p>
            <p></p>
            <p style={{ fontWeight: "bold" }}> To complete the registration process, you need to choose one of the following payment options:</p>

            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={paymentOption}
              onChange={handlePaymentChange}
            >
              <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                <FormControlLabel value="online" control={<Radio />} label="Option 1: Scan Venmo QR Code" />
                {/* <li>  Option 1: Scan Venmo QR Code</li> */}
                <ol>
                  <li> Open the Venmo app on your smartphone.</li>
                  <li> Select the "Scan" option.</li>
                  <li> Align your phone's camera with the provided QR code.</li>
                  <li> Enter the payment amount of $25 and proceed with the payment.</li>
                </ol>
                <p> <img src={qrcode} style={{ display: 'block', margin: 'auto', width: '250px', height: '300px' }} alt="react logo" /> </p>
              </Box>
              <Box component="span" sx={{ p: 2, border: '1px dashed grey', marginTop: 2, }}>
                <FormControlLabel value="inPerson" control={<Radio />} label="Option 2: In-Person Payment" />

                <p> If you prefer to make the payment in person, please contact Amy or Sara using the phone numbers provided below:</p>

                <li>  Amy Bishara: (925) 791-1098</li>
                <li>  Sara Magdy: (925) 393-8139</li>

                <p>  They will provide you with the necessary instructions for making the payment and completing the registration process.</p>
              </Box>
            </RadioGroup>

            <p> Should you have any further questions or need assistance, feel free to reach out to Amy or Sara.
            </p>
          </Typography>}
          <h2>Register</h2>
          {/* </Typography> */}
          {/* <Box sx={{ mt: 3 }}> */}
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                id="firstName"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                id="lastName"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mobile"
                variant="outlined"
                fullWidth
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                error={mobError}
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
                error={passwordError}
                required
              />
              <TextField
                label="Confirm Password"
                id="confirmPassword"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={passwordError}
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
            {/* <Grid container spacing={1}> */}
            {/* <Grid item xs={12} sm={6}></Grid> */}

            <Button onClick={addKid}>Add Kid</Button>
            {/* <Grid container spacing={1} > */}
            {kids.map((kid, i) => {
              return (
                <div key={i}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'TextField']}>
                      <Box sx={{
                        p: 2,
                        marginTop: 2, 
                        border: '1px dashed grey'
                      }}>
                        <Grid container spacing={1} >
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="firstName"
                              fullWidth
                              label="Kid's First Name"
                              onChange={(e) => handleChange(e.target.value, i, "first_name")}
                              value={kid.first_name || ""}
                              id="firstName"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="lastName"
                              fullWidth
                              label="Kid's Last Name"
                              onChange={(e) => handleChange(e.target.value, i, "last_name")}
                              value={kid.last_name || ""}
                              id="lastName"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <DatePicker
                              disableFuture={true}
                              label="Date Of Birth"
                              value={kid.dateOfBirth}
                              onChange={(date) => handleChange(date, i, "dateOfBirth")}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Divider variant="middle" />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              );
            })}
            {/* </Grid> */}

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
                error={adminPasswordError}
                onChange={(event) => setAdminPassword(event.target.value)}

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
          <Divider />


        </Box>
      </Container >
      <Snackbar open={error} autoHideDuration={6000} >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div >



  )
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired
};