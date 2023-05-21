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

export default function AddActionDialog({ isOpen, onClose, onAdd }) {
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

  const handleAddAction = () => {
    onAdd(selectedAction, points);
    setSelectedAction(actions[0]);
    setPoints('');
    onClose();
  };

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
    </Dialog>
  );
}