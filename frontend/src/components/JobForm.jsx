// src/components/JobForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const initialState = {
  title: '',
  company: '',
  status: 'Applied',
  notes: ''
};

const JobForm = ({ open, handleClose, currentJob, addOrUpdateJob }) => {
  const [job, setJob] = useState(initialState);

  useEffect(() => {
    if (currentJob) {
      setJob(currentJob);
    } else {
      setJob(initialState);
    }
  }, [currentJob, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    addOrUpdateJob(job);
    handleClose();
    setJob(initialState);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        {currentJob ? 'Edit Job Application' : 'Add New Job Application'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            name="title"
            label="Job Title"
            type="text"
            fullWidth
            variant="outlined"
            value={job.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="company"
            label="Company"
            type="text"
            fullWidth
            variant="outlined"
            value={job.company}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={job.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Offer">Offer</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={job.notes}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {currentJob ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobForm;
