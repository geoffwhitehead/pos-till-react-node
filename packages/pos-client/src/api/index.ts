import { create } from 'apisauce';

// TODO: learn how to use env vars in react native ios builds
const base = {
  local: 'http://localhost:5000',
  prod: 'https://positive-server.herokuapp.com',
};
const Api = create({
  baseURL: base.prod,
  headers: { Accept: 'application/json' },
});

export { Api };
