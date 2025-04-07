// src/services/api.js
import axios from 'axios';

// Define base URL based on environment
const baseURL = import.meta.env.PROD 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Job API services
export const jobService = {
  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  // Get a single job
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  
  // Create a new job
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },
  
  // Update a job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },
  
  // Delete a job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
};

export default api;
