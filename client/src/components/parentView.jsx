import * as React from 'react';
import { Paper, Box, TableCell, TableBody, TableContainer, Table, TableRow, TableHead } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchAppBar from './bar';
import KidView from './kidView';
import { Button, Dialog, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function ParentView({ propParent, logout }) {
    const [kids, setKids] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [showKidView, setShowKidView] = useState(false);
    const [edit, setEdit] = useState(false);
    const [parent, setParent] = useState(propParent);




    useEffect(() => {
        getKids(parent.id);
    }, [parent.id]);

    const getKids = (id) => {
        fetch(process.env.REACT_APP_BACKEND_HOST + '/kids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ parent_id: id })
        }).then(response => response.json())
            .then(data => setKids(data));
    }


    async function onClose() {
        await getKids(parent.id);
        setShowKidView(false);
    }
    const handleEdit = () => {
        setEdit(true);
    };
    const onEditClose = async () => {
        setEdit(false);

    };


    return (
        <>
            <SearchAppBar logout={logout} user={parent} />
            <Box sx={{ p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Mobile Number</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Home Address</TableCell>
                                <TableCell align="right">Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                key={parent.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {parent.name}
                                </TableCell>
                                <TableCell align="right">{parent.mobile_number}</TableCell>
                                <TableCell align="right">{parent.email}</TableCell>
                                <TableCell align="right">{parent.address}</TableCell>
                                <TableCell align="right" component="th" scope="row">
                                    <EditIcon onClick={() => handleEdit()} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Kid's Name</TableCell>
                                <TableCell align="right">Kid's Date Of Birth</TableCell>
                                <TableCell align="right">Kid's Total Points</TableCell>
                                <TableCell align="right">Kid's ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {kids.map((kid) => (
                                <TableRow
                                    key={kid.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button onClick={() => {
                                            setSelectedRow(kid)
                                            setShowKidView(true)
                                        }}>{kid.name}</Button>
                                    </TableCell>
                                    <TableCell align="right">{kid.dateofbirth}</TableCell>
                                    <TableCell align="right">{parseInt(kid.total_points)}</TableCell>
                                    <TableCell align="right">{kid.userid}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {showKidView && <Dialog open={showKidView} onClose={onClose}>
                    <DialogTitle>{selectedRow.name}' Points</DialogTitle>
                    <KidView kid={selectedRow} logout={logout} user="dialog" />
                </Dialog>}
                {edit && <Dialog open={edit} onClose={onEditClose}>
                    <DialogTitle>Edit</DialogTitle>
                    <EditParent id={parent.id} propName={parent.name} propMobile={parent.mobile_number} propAddress={parent.address} propEmail={parent.email} onClose={onEditClose} setParent={setParent} />
                </Dialog>}
            </Box>
        </>
    );
}

function EditParent({ id, propName, propMobile, propAddress, propEmail, onClose, setParent }) {
    const [name, setName] = useState(propName);
    const [mobileNumber, setMobileNumber] = useState(propMobile);
    const [address, setAddress] = useState(propAddress);
    const [email, setEmail] = useState(propEmail)

    const handleEditParent = () => {
        updateParent();
        onClose();
    };
    const updateParent = () => {
        fetch(process.env.REACT_APP_BACKEND_HOST + '/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, email: email, name: name, mobile: mobileNumber, address: address })
        }).then(response => {

                return response.json();
        }).then(data => {
            console.log(data);
            setParent(data);
        }).catch(error =>
            console.log(error));

    }
    return (
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
        // onSubmit={handleSubmit}
        >
            {/* <Grid container justifyContent="flex-end"></Grid> */}
            <Grid container spacing={1} justifyContent="flex-end">
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
            </Grid>
            <Grid container justifyContent="flex-end">
                <Button onClick={onClose} >Cancel </Button>
                <Button onClick={handleEditParent}>Save</Button>
            </Grid>
        </Box>


    );
}