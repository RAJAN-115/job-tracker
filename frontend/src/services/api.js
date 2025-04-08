// src/services/api.js
import axios from 'axios';
import config from '../config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Validate MongoDB ObjectId
const isValidObjectId = id => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

// Fetch with fallback data
const fetchWithFallback = async (apiCall, fallbackData) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API unavailable, using fallback data:', error);
    return fallbackData;
  }
};

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };

    // Network or connection error
    if (!error.response) {
      customError.message = 'Network error - please check your connection';
    }

    // Specific error handling
    switch (error.response?.status) {
      case 400:
        customError.message =
          error.response.data.message || 'Bad request - please check your input';
        break;
      case 401:
        customError.message = 'Unauthorized - please login again';
        break;
      case 404:
        customError.message = error.response.data.message || 'Resource not found';
        break;
      case 500:
        customError.message = 'Server error - please try again later';
        break;
      default:
        break;
    }

    return Promise.reject(customError);
  }
);

// Job API services
export const jobService = {
  // Get all jobs
  getAllJobs: async () => {
    return fetchWithFallback(
      async () => {
        const response = await api.get('/jobs');
        return response.data;
      },
      { success: true, count: 0, data: [] }
    );
  },

  // Get a single job
  getJobById: async id => {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid job ID format');
    }
    return fetchWithFallback(
      async () => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
      },
      { success: false, message: 'Job not found', data: null }
    );
  },

  // Create a new job
  createJob: async jobData => {
    return fetchWithFallback(
      async () => {
        const response = await api.post('/jobs', jobData);
        return response.data;
      },
      { success: false, message: 'Failed to create job', data: null }
    );
  },

  // Update a job
  updateJob: async (id, jobData) => {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid job ID format');
    }
    return fetchWithFallback(
      async () => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
      },
      { success: false, message: 'Failed to update job', data: null }
    );
  },

  // Delete a job
  deleteJob: async id => {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid job ID format');
    }
    return fetchWithFallback(
      async () => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
      },
      { success: false, message: 'Failed to delete job', data: {} }
    );
  },
};

export default api;
