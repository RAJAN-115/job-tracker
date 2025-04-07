// src/components/JobList.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const getStatusColor = (status) => {
  switch (status) {
    case 'Applied': return 'primary';
    case 'Interview': return 'info';
    case 'Offer': return 'success';
    case 'Rejected': return 'error';
    case 'Pending': return 'warning';
    default: return 'default';
  }
};

const JobList = ({ jobs, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>Job Title</strong></TableCell>
            <TableCell><strong>Company</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Application Date</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id} hover>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>
                <Chip 
                  label={job.status} 
                  color={getStatusColor(job.status)} 
                  size="small" 
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                {new Date(job.applicationDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => onEdit(job)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => onDelete(job._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {jobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No job applications found. Add your first one!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobList;
