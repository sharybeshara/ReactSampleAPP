import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Select, MenuItem, Button, TextField } from '@mui/material';

const actions = [
  "Behavior", 'Cleanup', 'Attendance', 'Participation', 'Helpful', 'Verse Memorization', 'Song Memorization', 'Games'];

export default function AddActionDialog({ isOpen, onClose, kid_id, selectedLabel, pastPoints, edit, action_id, selectedIds, redeem }) {
  const [selectedAction, setSelectedAction] = useState(selectedLabel||actions[0]);
  const [points, setPoints] = useState(pastPoints||0);
  
  const handleAddAction =  async() => {
    await addGroupAction();
    onClose();
    setSelectedAction(actions[0]);
    setPoints(0);
    
  };
  const handleEditAction = async() => {
    await updateAction();
    onClose();
    setSelectedAction(actions[0]);
    setPoints(0);
  };
  const handleRedeemAction = async() => {
    await redeemPoints();
    onClose();
    setPoints(0);
  };
  const handlePointsChange = (event) => {
    setPoints(event.target.value);
  };

  async function redeemPoints() {
    return fetch(process.env.REACT_APP_BACKEND_HOST + '/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kid_id: kid_id, action_type: "Redeem", points: parseInt(points*-1) })
    }).then(data => data.json())
      .catch(error => {
        console.log(error);
      });
  }

  async function addGroupAction() {
    return fetch(process.env.REACT_APP_BACKEND_HOST + '/groupAction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: selectedIds, action_type: selectedAction, points: points })
    }).then(data => data.json())
      .catch(error => {
        console.log(error);
      });
  }

  async function updateAction() {
    return fetch(process.env.REACT_APP_BACKEND_HOST+'/action', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: action_id, kid_id: kid_id, action_type: selectedAction, points: points})
    }).then(response => {
      if (response.status !== 204){
      console.log("error");
      }})
      .catch(error => {
          console.log(error);
      });
  }

  return (
   
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{edit? "Edit" : redeem? "Redeem":"Add"}Points </DialogTitle>
      <DialogContent>
        {!redeem && <Select  value={selectedAction} onChange={(event)=> setSelectedAction(event.target.value)}>
          {actions.map(action => (
            <MenuItem key={actions.indexOf(action)} value={action}>{action}</MenuItem>
          ))}
        </Select>}
        <TextField type="number" value={points} onChange={handlePointsChange} placeholder="Enter points" />
      </DialogContent>
      <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      {redeem &&   <Button onClick={handleRedeemAction} disabled={!points}>Redeem Points</Button>}
      {!edit && !redeem &&  <Button onClick={handleAddAction} disabled={!points}>Add Points</Button>}
      {edit && <Button onClick={handleEditAction} disabled={!points}>Edit Points</Button>}
      </DialogActions>
    </Dialog>
  );
}