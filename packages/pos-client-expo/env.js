import key from './build.env';

const environments = {
  staging: {
    BASE_URL: '',
  },
  production: {
    BASE_URL: 'https://positive-server.herokuapp.com/api',
  },
  local: {
    BASE_URL: 'http://localhost:5000/api',
  },
};

export const config = environments[key];
