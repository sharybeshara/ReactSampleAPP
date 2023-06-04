import * as React from 'react';
import { Paper, Box, TableCell, TableBody, TableContainer, Table, TableRow, TableHead } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchAppBar from './bar';
import KidView from './kidView';
import { Button, Dialog, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditParent from './editParent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import NewKid from './newKid';
import EditKid from './editKid';

export default function ParentView({ propParent, logout }) {
    const [kids, setKids] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [showKidView, setShowKidView] = useState(false);
    const [edit, setEdit] = useState(false);
    const [parent, setParent] = useState(propParent);
    const [selectedKid, setSelectedKid] = useState(0);
    const [openEditKid, setOpenEditKid] = useState(false);
    const [openNewKid, setOpenNewKid] = useState(false);

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
        }).then(response => { return response.json() })
            .then(data => setKids(data));
    }

    function onClose() {
        setOpenEditKid(false);
        setShowKidView(false);
        setOpenNewKid(false);
        setEdit(false);
    }
    const handleEdit = () => {
        setEdit(true);
    };
    const onEditClose = () => {
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
                                <TableCell>First Name</TableCell>
                                <TableCell align="right">Last Name</TableCell>
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
                                    {parent.first_name}
                                </TableCell>
                                <TableCell align="right">{parent.last_name}</TableCell>
                                <TableCell align="right">{parent.mobile_number}</TableCell>
                                <TableCell align="right">{parent.email}</TableCell>
                                <TableCell align="right">{parent.address}</TableCell>
                                <TableCell align="right" component="th" scope="row">
                                 <IconButton onClick={() => handleEdit()}>   <EditIcon  /> </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <Button align="right" variant="contained" onClick={() => {setOpenNewKid(true); setOpenEditKid(false);}} >
                    Add New Kid
                </Button>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Kid's First Name</TableCell>
                                <TableCell align="right">Kid's Last Name</TableCell>
                                <TableCell align="right">Kid's Date Of Birth</TableCell>
                                <TableCell align="right">Kid's Total Points</TableCell>
                                <TableCell align="right">Kid's ID</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {kids.map((kid, i) => (
                                <TableRow
                                    key={kid.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button onClick={() => {
                                            setSelectedRow(kid)
                                            setShowKidView(true)
                                        }}>{kid.first_name}</Button>
                                    </TableCell>
                                    <TableCell align="right">{kid.last_name}</TableCell>
                                    <TableCell align="right">{kid.dateofbirth}</TableCell>
                                    <TableCell align="right">{parseInt(kid.total_points)}</TableCell>
                                    <TableCell align="right">{kid.userid}</TableCell>
                                    <TableCell align="right" component="th" scope="row">
                                        <IconButton onClick={() => {
                                            setSelectedKid(i);
                                            setOpenEditKid(true);
                                        }}> <EditIcon /></IconButton></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {showKidView && <Dialog open={showKidView} onClose={onClose}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <DialogTitle>{selectedRow.first_name}' Points</DialogTitle>
                        <IconButton onClick={onClose} > <CloseIcon /> </IconButton>
                    </Box>
                    <KidView kid={selectedRow} />
                </Dialog>}
                <EditParent id={parent.id} propFName={parent.first_name} propLName={parent.last_name} propMobile={parent.mobile_number} propAddress={parent.address} propEmail={parent.email} onClose={onClose} setParent={setParent} edit={edit} />
               {openEditKid && <EditKid kid={kids[selectedKid]} onClose={onClose} open={openEditKid} setKids={setKids}/>}
                <NewKid parent_id={parent.id} show={openNewKid} onClose={onClose} setKids={setKids} kid={kids[selectedKid]} edit={openEditKid} />
            </Box>
        </>
    );
}
