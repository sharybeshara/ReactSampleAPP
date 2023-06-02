import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, Box } from '@mui/material';
import { Dialog, DialogTitle } from '@mui/material';

export default function EditParent({ id, propFName, propLName, propMobile, propAddress, propEmail, onClose, setParent, edit }) {
    const [firstName, setFirstName] = useState(propFName);
    const [lastName, setLastName] = useState(propLName);
    const [mobileNumber, setMobileNumber] = useState(propMobile);
    const [address, setAddress] = useState(propAddress);
    const [email, setEmail] = useState(propEmail)

    const handleEditParent =  () => {
        updateParent();
        // console.log(parent)
        onClose();
    };
    function updateParent()  {
        fetch(process.env.REACT_APP_BACKEND_HOST + '/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, email: email, first_name: firstName, last_name: lastName, mobile: mobileNumber, address: address })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error in server');
              }
            return response.json();})
            .then(data => setParent(data))
            .catch(error => console.log(error));

    }
    return (
        <Dialog open={edit} onClose={onClose}>
            <DialogTitle>Edit</DialogTitle>
            <Box
                sx={{
                    borderRadius: 2,
                    p: 2,
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'right',
                }}
                noValidate
                autoComplete="off"
              
            >
                {/* <Grid container justifyContent="flex-end"></Grid> */}
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            id="firstName"
                            variant="outlined"
                            fullWidth
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required

                            autoFocus
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
                </Grid>
                <Grid container justifyContent="flex-end">
                    <Button onClick={onClose} >Cancel </Button>
                    <Button onClick={handleEditParent} >Save</Button>
                </Grid>
            </Box>
        </Dialog>
    );
}