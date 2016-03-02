import assign from 'lodash/assign';
import identity from 'lodash/identity';
import map from 'lodash/fp/map';
import pick from 'lodash/fp/pick';
import flatMap from 'lodash/fp/flatMap';
import property from 'lodash/fp/property';
import uniqBy from 'lodash/fp/uniqBy';
import get from 'lodash/fp/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import flow from 'lodash/fp/flow';
import curryRight from 'lodash/curryRight';
import curry from 'lodash/curry';
import functions from 'lodash/functions';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

import { FETCH, ERROR, SUCCESS, LOGOUT } from './constants';

export const key = ({ type, id }) => `${type}@${id}`;
export const typeId = pick(['type', 'id']);
export const uniqById = uniqBy(key);

const normalizeResponses = flow(
  flatMap(get('response.data')),
  uniqById
)

const DEFAULT_STATE = {
  authorization: false,
  history: [],
  resources: []
}

export function reducer(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOGOUT:
      return {...DEFAULT_STATE}

    case FETCH: {
      switch(action.status) {
        case SUCCESS: {
          state.history = [action, ...state.history];
          state.resources = normalizeResponses(state.history);

          let resource = findResource({ api: state }, typeId(action.response.data), identity);

          switch(action.meta.resource.type) {
            case 'login': {
              state.authorization = `Bearer ${resource.token}`
              state.account = resource.account;
            }
          }

          return { ...state }
        }
        case ERROR:
          return {
            ...state,
            error: {
              message: "its broke",
              action: {
                label: 'retry',
                action: action.meta.command.retry
              }
            }
          }

      }
    }

    default:
      return state;
  }
}

export const selectAuthorization = get('api.authorization');
export const selectRequestHistory = get('api.history');
export const selectResources = get('api.resources');

export function findRequest (state, query) {
  state = isFunction(state) ? state() : selectRequestHistory(state);

  return find(state, query)
}

export function filterRequest (state, query) {
  state = isFunction(state) ? state() : selectRequestHistory(state);

  return filter(state, query)
}

export function findResource (state, query) {
  state = isFunction(state) ? state() : selectResources(state);

  return find(state, query)
}

export function filterResources (state, query) {
  state = isFunction(state) ? state() : selectResources(state);

  return filter(state, query)
}
