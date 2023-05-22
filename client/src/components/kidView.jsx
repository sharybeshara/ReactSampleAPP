import * as React from 'react';
import {Paper, Box, TableCell, TableBody, TableContainer, Table, TableRow, TableHead} from '@mui/material';
import {useEffect, useState} from 'react';
import SearchAppBar from './bar';

export default function KidView({kid, logout}) {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    getActions(kid.id);
  }, []);

  function getActions(id) {
    return fetch('http://localhost:8080/actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user_id: id})
    }).then(response => {
      console.log(response);
      return response.json();
    })
    .then(data => {
      setActions(data);
    });
  }
  return (
   <>
   <SearchAppBar  logout={logout} />
   <Box sx={{p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              key={kid.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {kid.name}
              </TableCell>
              <TableCell align="right">{kid.email}</TableCell>
              <TableCell align="right">{parseInt(kid.total_points) }</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
   </Box>

<Box sx={{p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>Action Type</TableCell>
        <TableCell align="right">Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {actions.map((row) => (
            <TableRow
              key={row.action_type}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.action_type}
              </TableCell>
              <TableCell align="right">{parseInt(row.points)}</TableCell>
            </TableRow>
          ))}
    </TableBody>
  </Table>
</TableContainer>
</Box>
</>
  );
}