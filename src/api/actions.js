import merge from 'lodash/merge';
import URL from 'url';

import { FETCH, LOGOUT } from './constants';

export const API_URL = process.env.API_URL;

export const DEFAULTS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

export function fetch (
  path, { type, id, data, method, query, ...options }={ }) {

  let url = URL.format({
    host: API_URL,
    pathname: URL.resolve('/', path),
    query
  });

  return {
    type: FETCH,
    request:
      merge(DEFAULTS, options, {
        url,
        method,
        body: { data }
      }),
    meta: {
      path,
      resource: { type, id }
    }
  }
}

export function postLogin ({ email, password }) {
  return fetch('login', { method: 'get', type: 'login' })
}

export function fetchUsers () {
  return fetch('users', { method: 'get', type: 'user' })
}

export function fetchUser ({ id: userId }) {
  return fetch('user', {
    method: 'get',
    type: 'profile',
    query: {
      userId
    }
  })
}

export function fetchPostsByUser ({ id: userId }) {
  return fetch('user/posts', {
    method: 'get',
    type: 'profile',
    query: {
      userId
    }
  })
}

export function logout () {
  return {
    type: LOGOUT
  }
}
