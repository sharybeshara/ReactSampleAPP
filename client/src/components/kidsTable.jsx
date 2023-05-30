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
import KidView from './kidView';
import {Button, Dialog, DialogTitle} from '@mui/material';

export default function KidsTable({logout}) {
  const [searchedVal, setSearchedVal] = useState("");
  const [kids, setKids] = useState([]);
  const [addActionDialogOpen, setAddActionDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [showKidView, setShowKidView] = useState(false);

  const onChangeSearch = (event) => {
    console.log(event.target.value);
    setSearchedVal( event.target.value);
  };
  useEffect(() => {
    getKids();
  }, []);

  function getKids() {
    fetch(process.env.REACT_APP_BACKEND_HOST+'/allKids')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        setKids(data);
      });

}
    async function onClose (){
      await getKids();
      setAddActionDialogOpen(false);
      setShowKidView(false);
    }
  
  return (
    <>
    <SearchAppBar onChangeSearch={onChangeSearch} logout={logout} user="admin"/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kids.filter(((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    })).sort((a, b) => a.name > b.name ? 1 : -1).map((row) => (
            <TableRow
              
              key={row.name}
              hover={true}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
               <Button onClick={() => {setSelectedRow(row) 
                setShowKidView(true)}}>{row.name}</Button> 
              </TableCell>
              <TableCell align="right">{row.userid}</TableCell>
              <TableCell align="right">{parseInt(row.total_points)}</TableCell>
              <TableCell align="right"><AddBoxIcon onClick={() => {setAddActionDialogOpen(true)
              setSelectedRow(row)}} >
               </AddBoxIcon></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <AddActionDialog isOpen={addActionDialogOpen} onClose={onClose} kid_id={selectedRow.id} /> 
    {showKidView &&  <Dialog open={showKidView} onClose={onClose}>
    <DialogTitle>{selectedRow.name}' Actions</DialogTitle>
      <KidView kid={selectedRow} logout={logout} user="dialog"/> 
      </Dialog>}
    </>
  );
}