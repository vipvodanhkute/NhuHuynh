import { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR } from './constants';

export function login({ query = {} }) {
  return {
    type: LOGIN,
    payload: {
      query,
    },
  };
}

export function loginError({ query = {} }) {
  return {
    type: LOGIN_ERROR,
    payload: {
      query,
    },
  };
}

export function loginSuccess({ query = {} }) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      query,
    },
  };
}
