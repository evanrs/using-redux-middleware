import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import DevTools from './DevTools'
import routes from '../routes'


class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render () {
    const { store } = this.props;
    const history = syncHistoryWithStore(browserHistory, store);

    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes} />
          { !! process.env.DEVTOOLS &&
            <DevTools />
          }
        </div>
      </Provider>
    )
  }
}

export default Root;
