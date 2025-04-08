// src/App.jsx
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Header from './components/Header';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import config from './config';
import { jobService } from './services/api';
import theme from './theme/theme';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/`);
        if (response.data && response.data.status === 'ok') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        console.error('Backend connection error:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      setJobs(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Error fetching jobs');
      showNotification(error.message || 'Error fetching jobs', 'error');
    } finally {
      setLoading(false);
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

  const handleEditJob = job => {
    setCurrentJob(job);
    setOpenForm(true);
  };

  const handleDeleteJob = async id => {
    try {
      setLoading(true);
      await jobService.deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
      showNotification('Job deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting job:', error);
      showNotification(error.message || 'Error deleting job', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateJob = async jobData => {
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
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {/* Backend Status Indicator */}
          {backendStatus === 'disconnected' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Backend service is currently unavailable. Some features may be limited. Please try
              again in a few moments.
            </Alert>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
              Job Applications
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              disabled={backendStatus === 'disconnected'}
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
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : (
            <JobList jobs={jobs} onEdit={handleEditJob} onDelete={handleDeleteJob} />
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
            backgroundColor: theme.palette.grey[100],
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
