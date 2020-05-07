import { create } from 'apisauce';
import AsyncStorage from '@react-native-community/async-storage';

// TODO: learn how to use env vars in react native ios builds
const base = {
  local: 'http://localhost:5000/api',
  prod: 'https://positive-server.herokuapp.com/api',
};

const api = create({
  baseURL: base.local,
  headers: { Accept: 'application/json' },
});

api.addMonitor(async response => {
  if (response.ok) {
    const accessToken = response.headers['authorization'];
    const refreshToken = response.headers['x-refresh-token'];

    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken);
      api.setHeader('authorization', accessToken);
    }
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
      api.setHeader('x-refresh-token', refreshToken);
    }
  }
});

export { api };
