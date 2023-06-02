import * as React from 'react';
import {Paper, Box, TableCell, TableBody, TableContainer, Table, TableRow, TableHead} from '@mui/material';
import {useEffect, useState} from 'react';

export default function KidView({kid}) {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const getActions = (id) => {
      return fetch(process.env.REACT_APP_BACKEND_HOST+'/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({kid_id: id})
      }).then(response => {
        return response.json();
      })
      .then(data => {
        setActions(data);
      });
    }
    getActions(kid.id);
  }, [kid.id]);

  return (
   <>
   <Box sx={{p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
    <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              key={kid.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {kid.first_name}
              </TableCell>
              <TableCell align="right">{kid.last_name}</TableCell>
              <TableCell align="right">{kid.userid}</TableCell>
              <TableCell align="right">{parseInt(kid.total_points) }</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
   </Box>

<Box sx={{p: 2, bgcolor: 'background.default', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
<TableContainer component={Paper}>
  <Table  aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>Action Type</TableCell>
        <TableCell align="right">Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {actions.map((row) => (
            <TableRow
              key={row.id}
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