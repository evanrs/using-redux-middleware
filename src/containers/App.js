import React, { Component, PropTypes } from 'react';
import { deepOrange500 } from 'material-ui/lib/styles/colors';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import Colors from 'material-ui/lib/styles/colors';

import { connect } from 'react-redux';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: Colors.cyan300,
  }
});

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render () {
    let { error, dispatch } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          { error &&
            <div>
              {error.message}
              <div onClick={() => dispatch(error.action.action)}>
                {error.action.label}
              </div>
            </div>
          }
          {this.props.children}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(state => ({ error: state.api.error }))(App)
