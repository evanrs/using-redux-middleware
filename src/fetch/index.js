export const FETCH = 'FETCH';

export function fetch (path, options) {
  return {
    type: FETCH,
    payload: {
      path, options }
  }
}
