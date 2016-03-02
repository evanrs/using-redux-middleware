import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'

import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'

import { APIMiddleware } from '../api/middleware'
import { intervalMiddleware } from '../store/interval';

import DevTools from '../containers/DevTools'
import rootReducer from '../reducers'
import * as API from "../api/actions";


export default function configureStore(initialState) {
  let lazyMiddleware = APIMiddleware;
  const middleware =
    applyMiddleware(
      thunk,
      intervalMiddleware,
      (store) => (next) => (action) => lazyMiddleware(store)(next)(action),
      routerMiddleware(browserHistory),
      createLogger()
    )

  const store = createStore(
    rootReducer,
    initialState,
    !! process.env.DEVTOOLS && process.env.NODE_ENV !== 'production' ?
      compose(middleware, DevTools.instrument())
    : middleware
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })

    module.hot.accept('../api/middleware', () => {
      lazyMiddleware = require('../api/middleware').APIMiddleware
    })
  }

  return store
}
