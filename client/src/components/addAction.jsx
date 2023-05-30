import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, Button } from '@mui/material';

const actions = [
  { label: 'Behavior', points: 10 },
  { label: 'Cleanup', points: 20 },
  { label: 'Attendance', points: 30 },
  { label: 'Participation', points: 30 },
  { label: 'Helpful', points: 30 },
  { label: 'Verse Memorization', points: 30 },
  { label: 'Song Memorization', points: 30 },
  { label: 'Games', points: 30 },
];

export default function AddActionDialog({ isOpen, onClose, kid_id}) {
  const [selectedAction, setSelectedAction] = useState(actions[0]);
  const [points, setPoints] = useState('');

  const handleActionChange = (event) => {
    const selectedLabel = event.target.value;
    const selected = actions.find(action => action.label === selectedLabel);
    setSelectedAction(selected);
  };

  const handlePointsChange = (event) => {
    setPoints(event.target.value);
  };

  const handleAddAction = async() => {
    await addAction();
    setSelectedAction(actions[0]);
    setPoints('');
    onClose();
  };

  async function addAction() {
    return fetch(process.env.REACT_APP_BACKEND_HOST+'/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({kid_id: kid_id, action_type: selectedAction.label, points: points })
    }).then(data => data.json())
      .catch(error => {
          console.log(error);
      });
   }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add Action</DialogTitle>
      <DialogContent>
        <Select value={selectedAction.label} onChange={handleActionChange}>
          {actions.map(action => (
            <MenuItem key={action.label} value={action.label}>{action.label}</MenuItem>
          ))}
        </Select>
        <input type="number" value={points} onChange={handlePointsChange} placeholder="Enter points" />
      </DialogContent>
      <Button onClick={handleAddAction} disabled={!points}>Add Action</Button>
      <Button onClick={onClose}>Cancel</Button>
    </Dialog>
  );
}