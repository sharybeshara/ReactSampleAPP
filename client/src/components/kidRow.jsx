import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import AddActionDialog from './addAction';
// import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { Button, Dialog, DialogTitle, DialogActions, Checkbox } from '@mui/material';

import { useEffect, useState } from 'react';

export default function KidRow({ kid, getKids, role, index, handleSelectKid, isSelected }) {
    const [open, setOpen] = useState(false);
    const [actions, setActions] = useState([]);
    const [addActionDialogOpen, setAddActionDialogOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [selectedPoints, setSelectedPoints] = useState(0);
    const [selectedAction, setSelectedAction] = useState(0);
    const [edit, setEdit] = useState(false);
    const [showParent, setShowParent] = useState(false);

    const onClose = async () => {
        await getActions(kid.id);
        await getKids();
        setSelectedLabel('');
        setSelectedPoints(0);
        setAddActionDialogOpen(false);
        setEdit(false);
    }

    const getActions = async (id) => {
        return fetch(process.env.REACT_APP_BACKEND_HOST + '/actions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ kid_id: id })
        }).then(response => {
            return response.json();
        })
            .then(data => {
                setActions(data);
            });
    }
    const deleteAction = async (id, points) => {
        return fetch(process.env.REACT_APP_BACKEND_HOST + '/action', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, points: points, kid_id: kid.id })
        }).then(response => {
            if (response.status !== 204) {
                console.log("error");
            }

        })
            .catch(error => {
                console.log(error);
            });
    }
    const handleChange = (open) => {
        setOpen(open);
        if (open) {
            getActions(kid.id)
        }
    };
    const handleDelete = async (action_id, points) => {
        await deleteAction(action_id, points);
        await getActions(kid.id);
        await getKids();
    };
    const handleEdit = (id, label, points) => {
        setSelectedAction(id)
        setSelectedLabel(label);
        setSelectedPoints(points);
        setEdit(true);
        setAddActionDialogOpen(true);
    };
    const showParentDetails = () => {
        setShowParent(true);
    };
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover={true} selected={open} onClick={() => handleChange(!open)}>
                {/* <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleChange(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell> */}
                <TableCell scope="row">
                    <Box sx={{ fontWeight: 'bold' }}>
                        {index + 1 + ')'}
                    </Box>
                </TableCell>
                <TableCell component="th" scope="row">
                    {kid.first_name}
                </TableCell>
                <TableCell align="right">{kid.last_name}</TableCell>
                <TableCell align="right">{kid.userid}</TableCell>
                <TableCell align="right">{kid.total_points}</TableCell>
                <TableCell align="right">
                    <Checkbox
                        checked={isSelected(kid.id)}
                        onChange={() => {
                            setOpen(false)
                            handleSelectKid(kid.id)
                        }}
                        color="primary"
                    /></TableCell>
                {/* <TableCell align="right"> <IconButton onClick={() => { setAddActionDialogOpen(true) }}><AddBoxIcon  > */}
                {/* </AddBoxIcon></IconButton></TableCell> */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    {kid.first_name}'s Points
                                </Typography>
                                <IconButton onClick={() => showParentDetails()}> <ContactEmergencyIcon /> </IconButton>
                            </Box>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Points</TableCell>
                                        {role === "super" && <TableCell align="right" >Actions</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actions.map((action) => (
                                        <TableRow key={action.id}>
                                            <TableCell component="th" scope="row">
                                                {action.action_type}
                                            </TableCell>
                                            <TableCell>{parseInt(action.points)}</TableCell>
                                            {role === "super" && <TableCell align="right" component="th" scope="row">
                                                <IconButton onClick={() => handleEdit(action.id, action.action_type, parseInt(action.points))}> <EditIcon /></IconButton>
                                                <IconButton onClick={() => handleDelete(action.id, action.points)} > <DeleteIcon /> </IconButton>
                                            </TableCell>}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            {!edit && <AddActionDialog isOpen={addActionDialogOpen} onClose={onClose} kid_id={kid.id} />}
            {edit && <AddActionDialog isOpen={addActionDialogOpen} onClose={onClose} kid_id={kid.id} selectedLabel={selectedLabel} pastPoints={selectedPoints} edit={edit} action_id={selectedAction} />}
            {showParent && <ParentDialog id={kid.parent_id} showParent={showParent} setShowParent={setShowParent} />}
        </React.Fragment>
    );
}

function ParentDialog({ id, showParent, setShowParent }) {
    const [parent, setParent] = useState({});
    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_HOST + '/userById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        }).then(response => response.json())
            .then(data => setParent(data));
    }, [id]);

    const handleClose = () => {
        setShowParent(false);
    };

    return (
        <Dialog open={showParent} onClose={handleClose}>
            <DialogTitle>Parent's Info</DialogTitle>
            <Box sx={{ p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell align="right">Last Name</TableCell>
                                <TableCell align="right">Mobile Number</TableCell>
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
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >Address</TableCell>
                                <TableCell align="right">Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="right">{parent.address}</TableCell>
                                <TableCell align="right">{parent.email}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog >
    );


}
