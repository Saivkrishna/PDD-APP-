import Constants from 'expo-constants';

// Dynamically resolve local machine IP when running on Expo Go (virtual or physical devices)
// Always connect to the live Render backend
export const API_URL = 'https://career-guidance-app-yx5h.onrender.com/api';
console.log('[API_URL resolved to]:', API_URL);
