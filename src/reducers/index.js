import { routerReducer } from 'react-router-redux'
import { combineReducers, compose } from 'redux'

import { globalReducer } from './globalReducer';
import { reducer as APIReducer } from '../api/reducer'
import { reducer as namespace } from 'redux-namespace'

import flow from "lodash/flow";

const rootReducer =
  flow(
    combineReducers({
      routing: routerReducer,
      api: APIReducer,
      global: globalReducer,
      namespace
    }),
    (state) => {
      let { routing, namespace, ...filtered } = state;

      try {
        localStorage.setItem('store', JSON.stringify(filtered))
      } catch (e) {}

      return state;
    }
  );

export default rootReducer;
