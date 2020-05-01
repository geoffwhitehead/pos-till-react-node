import { create } from 'apisauce';

// TODO: learn how to use env vars in react native ios builds
const base = {
  local: 'http://localhost:5000/api',
  prod: 'https://positive-server.herokuapp.com/api',
};
const Api = create({
  baseURL: base.local,
  headers: { Accept: 'application/json' },
});

export { Api };
