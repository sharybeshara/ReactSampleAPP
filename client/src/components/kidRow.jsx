import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import AddActionDialog from './addAction';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useState } from 'react';

export default function KidRow({ kid, getKids, role }) {
    const [open, setOpen] = useState(false);
    const [actions, setActions] = useState([]);
    const [addActionDialogOpen, setAddActionDialogOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [selectedPoints, setSelectedPoints] = useState(0);
    const [selectedAction, setSelectedAction] = useState(0);
    const [edit, setEdit] = useState(false);

    const onClose = async() => {
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
   const deleteAction = async(id, points) => {
        return fetch(process.env.REACT_APP_BACKEND_HOST+'/action', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: id, points: points, kid_id: kid.id})
        }).then(response => {
          if (response.status !== 204){
          console.log("error");
          }})
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
                <TableCell component="th" scope="row">
                    {kid.name}
                </TableCell>
                <TableCell align="right">{kid.userid}</TableCell>
                <TableCell align="right">{kid.total_points}</TableCell>
                <TableCell align="right"><AddBoxIcon onClick={() => { setAddActionDialogOpen(true) }} >
                </AddBoxIcon></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {kid.name}'s Points
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Points</TableCell>
                                      {role==="super" &&  <TableCell align="right" >Actions</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actions.map((action) => (
                                        <TableRow key={action.id}>
                                            <TableCell component="th" scope="row">
                                                {action.action_type}
                                            </TableCell>
                                            <TableCell>{parseInt(action.points)}</TableCell>
                                            {role==="super" && <TableCell align="right" component="th" scope="row">
                                                <EditIcon onClick={() => handleEdit(action.id, action.action_type, parseInt(action.points) )} />
                                                <DeleteIcon onClick={() => handleDelete(action.id, action.points)} />
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
        </React.Fragment>
    );
}
