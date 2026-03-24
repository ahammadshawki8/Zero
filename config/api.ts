// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
  // In production, you might want to use a different URL
  // API_CONFIG.BASE_URL = 'https://your-production-api.com/api';
}

export default API_CONFIG;