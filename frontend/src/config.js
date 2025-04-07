// Configuration for different environments
const config = {
  // Version
  version: '1.0.1',

  // API URLs
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',

  // Other configuration
  defaultPageSize: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],

  // Feature flags
  features: {
    enableNotifications: false,
    enableAnalytics: false,
  },
};

export default config;
