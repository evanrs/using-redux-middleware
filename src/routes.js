import flow from "lodash/flow";

import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import Dashboard from './containers/Dashboard'
import UserProfile from './containers/UserProfile'
import PostDetails from './containers/PostDetails'
import Login from './containers/Login'

import store from './store';
import { selectAuthorization } from './api/reducer';


function redirectToLogin(nextState, replace) {
  if (! selectAuthorization(store.getState())) {
    replace({
      pathname: '/login',
      state: { next: nextState.location.pathname + nextState.location.search }
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (selectAuthorization(store.getState())) {
    replace({
      pathname: '/'
    });
  }
}

export default (
  <Route component={App}>
    <Route onEnter={redirectToDashboard} path="/login" component={Login}/>
    <Route onEnter={redirectToLogin} path="/" component={Dashboard}>
      <Route path="user/:userId" component={UserProfile} />
    </Route>
  </Route>
)
