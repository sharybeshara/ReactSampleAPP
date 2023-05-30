import * as React from 'react';
import { Paper, Box, TableCell, TableBody, TableContainer, Table, TableRow, TableHead } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchAppBar from './bar';
import KidView from './kidView';
import {Button, Dialog, DialogTitle} from '@mui/material';

export default function ParentView({ parent, logout }) {
    const [kids, setKids] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [showKidView, setShowKidView] = useState(false);

    useEffect(() => {
        getKids(parent.id);
    }, [parent.id]);

    const getKids = (id) => {
        return fetch(process.env.REACT_APP_BACKEND_HOST + '/kids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ parent_id: id })
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => {
            setKids(data);
        });
    }

    async function onClose (){
        await getKids(parent.id);
        setShowKidView(false);
      }

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
                    <DialogTitle>{selectedRow.name}' Actions</DialogTitle>
                    <KidView kid={selectedRow} logout={logout} user="dialog" />
                </Dialog>}
            </Box>

        </>

    );

}