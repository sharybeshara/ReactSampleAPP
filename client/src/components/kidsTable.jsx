import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchAppBar from './bar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {useEffect, useState} from 'react';
import AddActionDialog from './addAction';


export default function KidsTable(props) {
  const [searchedVal, setSearchedVal] = useState("");
  const [kids, setKids] = useState([]);
  const [addActionDialogOpen, setAddActionDialogOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [points, setPoints] = useState(0);

  const onChangeSearch = (event) => {
    console.log(event.target.value);
    setSearchedVal( event.target.value);
  };
  useEffect(() => {
    getKids();
  }, []);

  function getKids() {
    fetch('http://localhost:8080/kids')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        setKids(data);
      });
      
  }
  const handleAddAction = (action, comingPoints) => {
    const newAction = { ...action, comingPoints: parseInt(comingPoints) };
    setActions([...actions, newAction]);
    setPoints(points+comingPoints);
  };
  
  return (
    <>
    <SearchAppBar onChangeSearch={onChangeSearch} logout={props.logout} />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kids.filter(((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    })).map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{parseInt(row.total_points) + parseInt(points)}</TableCell>
              <TableCell align="right"><AddBoxIcon onClick={() => setAddActionDialogOpen(true)}>
               </AddBoxIcon></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <AddActionDialog isOpen={addActionDialogOpen} onClose={() => setAddActionDialogOpen(false)} onAdd={handleAddAction} /> 
    </>
  );
}