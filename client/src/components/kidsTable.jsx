import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchAppBar from './bar';
import { useEffect, useState } from 'react';
import KidRow from './kidRow'

export default function KidsTable({ logout, role }) {
  const [searchedVal, setSearchedVal] = useState("");
  const [kids, setKids] = useState([]);

  const onChangeSearch = (event) => {
    setSearchedVal(event.target.value);
  };
  useEffect(() => {
    getKids();
  }, []);

  function getKids() {
    fetch(process.env.REACT_APP_BACKEND_HOST + '/allKids')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setKids(data);
      });

  }
  return (
    <>
      <SearchAppBar onChangeSearch={onChangeSearch} logout={logout} user="admin" />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {/* <TableCell /> */}
              <TableCell>First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">Total Points</TableCell>
              <TableCell align="right">Add Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {kids.filter(((row) => {
              return row.userid.toLowerCase().includes(searchedVal.toLowerCase());
            })).sort((a, b) => a.first_name > b.first_name  ? 1 : -1).map((row) => (
              
                <KidRow key={row.id} kid={row} getKids={getKids} role={role} />
              
            ))}

          </TableBody>
        </Table>
      </TableContainer>
      {/* <AddActionDialog isOpen={addActionDialogOpen} onClose={onClose} kid_id={selectedRow.id} />
      {showKidView && <Dialog open={showKidView} onClose={onClose}>
        <DialogTitle>{selectedRow.name}' Actions</DialogTitle>
        <KidView kid={selectedRow} logout={logout} user="admin" />
      </Dialog>} */}
    </>
  );
}