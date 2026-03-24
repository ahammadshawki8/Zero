// API Configuration
export const API_CONFIG = {
  BASE_URL: (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

export default API_CONFIG;