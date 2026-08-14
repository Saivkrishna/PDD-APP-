import Constants from 'expo-constants';

// Dynamically resolve local machine IP when running on Expo Go (virtual or physical devices)
const debuggerHost = Constants.expoConfig?.hostUri || '';
const ip = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

export const API_URL = `http://${ip}:2259/api`;
console.log('[API_URL resolved to]:', API_URL);
