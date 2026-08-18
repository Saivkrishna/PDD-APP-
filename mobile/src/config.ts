import Constants from 'expo-constants';

// Dynamically resolve local machine IP when running on Expo Go (virtual or physical devices)
// Always connect to the live Render backend
export const API_URL = 'https://career-guidance-app-yx5h.onrender.com/api';
console.log('[API_URL resolved to]:', API_URL);

// Web Client ID from Google Cloud Console / Firebase (ends in .apps.googleusercontent.com)
export const GOOGLE_WEB_CLIENT_ID = '162671597184-YOUR_CLIENT_ID.apps.googleusercontent.com';
