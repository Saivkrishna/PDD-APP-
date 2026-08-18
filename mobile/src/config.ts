import Constants from 'expo-constants';

// Dynamically resolve local machine IP when running on Expo Go (virtual or physical devices)
const debuggerHost = Constants.expoConfig?.hostUri || '';
const ip = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

// Use local backend for development (Expo Go), and live Render API for production
export const API_URL = __DEV__
  ? `http://${ip}:2259/api`
  : 'https://career-guidance-app-yx5h.onrender.com/api';
console.log('[API_URL resolved to]:', API_URL);
