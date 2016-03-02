import get from 'lodash/fp/get';

import { SEARCH } from '../constants';

export function globalReducer (state={}, action) {
  switch(action.type) {
    case SEARCH:
      return {
        ...state,
        search: action.payload
      }
  }

  return state;
}

export const selectSearch = get('global.search')

export default globalReducer;
