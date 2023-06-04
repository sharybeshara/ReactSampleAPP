import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, Box } from '@mui/material';
import { Dialog, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function EditKid({ kid, onClose, open, setKids }) {
    const [firstName, setFirstName] = useState(kid.first_name);
    const [lastName, setLastName] = useState(kid.last_name);
    const [dateOfBirth, setDateOfBirth] = useState(dayjs(kid.dateofbirth));

    const editKid = () => {
        updateKid();
        onClose();
    };
    function updateKid() {
        fetch(process.env.REACT_APP_BACKEND_HOST + '/kid', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: kid.id, first_name: firstName, last_name: lastName, dateofbirth: dateOfBirth })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error in server');
            }
            return response.json();
        })
        .then(data => setKids(current => (current.map(
              el => el.id === data.id?  data : el
            ))))
            .catch(error => console.log(error));

    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Kid's Info</DialogTitle>
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
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'TextField', 'TextField']}>
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
                                <DatePicker
                                    disableFuture={true}
                                    label="Date Of Birth"
                                    value={dateOfBirth}
                                    onChange={(date) => setDateOfBirth(date)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Button onClick={onClose} >Cancel </Button>
                            <Button onClick={editKid} >Save</Button>
                        </Grid>
                    </DemoContainer>
            </LocalizationProvider>
            </Box>
        </Dialog>
    );
}