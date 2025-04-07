// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Snackbar, 
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import theme from './theme/theme';
import Header from './components/Header';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import { jobService } from './services/api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching jobs: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      showNotification('Error fetching jobs', 'error');
    }
  };

  const handleOpenForm = () => {
    setCurrentJob(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentJob(null);
  };

  const handleEditJob = (job) => {
    setCurrentJob(job);
    setOpenForm(true);
  };

  const handleDeleteJob = async (id) => {
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
      showNotification('Job deleted successfully', 'success');
    } catch (err) {
      showNotification('Error deleting job', 'error');
      console.error(err);
    }
  };

  const addOrUpdateJob = async (jobData) => {
    try {
      if (jobData._id) {
        // Update existing job
        const response = await jobService.updateJob(jobData._id, jobData);
        setJobs(jobs.map(job => (job._id === jobData._id ? response.data : job)));
        showNotification('Job updated successfully', 'success');
      } else {
        // Add new job
        const response = await jobService.createJob(jobData);
        setJobs([response.data, ...jobs]);
        showNotification('Job added successfully', 'success');
      }
    } catch (err) {
      showNotification('Error processing job data', 'error');
      console.error(err);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
              Job Applications
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              Add New
            </Button>
          </Box>
          
          {/* Loading State */}
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          ) : (
            <JobList 
              jobs={jobs} 
              onEdit={handleEditJob} 
              onDelete={handleDeleteJob} 
            />
          )}
          
          {/* Job Form Dialog */}
          <JobForm 
            open={openForm} 
            handleClose={handleCloseForm}
            currentJob={currentJob}
            addOrUpdateJob={addOrUpdateJob}
          />
          
          {/* Notification Snackbar */}
          <Snackbar 
            open={notification.open} 
            autoHideDuration={6000} 
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.severity} 
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto', 
            backgroundColor: theme.palette.grey[100] 
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Job Application Tracker
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
