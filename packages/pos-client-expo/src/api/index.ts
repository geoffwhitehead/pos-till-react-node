
import { create } from 'apisauce';
import { config } from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = create({
  baseURL: config.BASE_URL,
  headers: { Accept: 'application/json' },
});

api.addMonitor(async response => {
  if (response.ok) {
    const accessToken = response?.headers?.['authorization'];
    const refreshToken = response?.headers?.['x-refresh-token'];

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

// TODO: refactor this ...
export const okResponse = (response: any) => {
  if (response.ok && response.data?.success) {
    return response.data.data;
  } else {
    throw new Error('Failed: Response: ' + response.data?.success + 'Problem: ' + response.problem);
  }
};

export { api };
