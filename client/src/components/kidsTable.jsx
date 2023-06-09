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
import { Button } from '@mui/material';
import AddActionDialog from './addAction';

export default function KidsTable({ logout, role }) {
  const [searchedVal, setSearchedVal] = useState("");
  const [kids, setKids] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [addActionDialogOpen, setAddActionDialogOpen] = useState(false);

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

  const handleSelectKid = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((kidId) => kidId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const isSelected = (id) => {
    if (selectedIds.includes(id)) {
      return true;
    } else {
      return false;
    }
  };
  const onClose = async () => {
    // await getActions(kid.id);
    await getKids();
    setSelectedIds([]);
    // setSelectedLabel('');
    // setSelectedPoints(0);
    setAddActionDialogOpen(false);
    // setEdit(false);
}

  return (
    <>
      <SearchAppBar onChangeSearch={onChangeSearch} logout={logout} user="admin" />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">Total Points</TableCell>
              <TableCell align="right"><Button variant="contained" onClick={() => { setAddActionDialogOpen(true) }}>Add points</Button></TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>

            {kids.filter(((row) => {
              return row.userid.toLowerCase().includes(searchedVal.toLowerCase());
            })).sort((a, b) => a.first_name > b.first_name  ? 1 : -1).map((row, i) => (
              
                <KidRow key={row.id} kid={row} getKids={getKids} role={role} index={i} handleSelectKid={handleSelectKid} isSelected={isSelected} />
              
            ))}

          </TableBody>
        </Table>
      </TableContainer>
      <AddActionDialog isOpen={addActionDialogOpen} onClose={onClose} selectedIds={selectedIds} />
    </>
  );
}