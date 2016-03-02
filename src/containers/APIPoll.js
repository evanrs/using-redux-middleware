import isEmpty from 'lodash/isEmpty';

import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import CircularProgress from 'material-ui/lib/circular-progress';
import * as timing from '../store/interval';

import { filterRequest } from '../api/reducer';


function connector (state, props) {
  let history = filterRequest(state, {});

  return {
    history: filterRequest(state, { request: { url: props.action.request.url } })
  }
}

class APIPoll extends Component {
  static propTypes = {
    action: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    history: PropTypes.array.isRequired,
    interval: PropTypes.number,
    wait: PropTypes.bool,
    poll: PropTypes.bool
  };

  static defaultProps = {
    children: <div>oops</div>,
    history: [],
    interval: 30000,
    wait: true,
    poll: true
  };

  componentDidMount () {
    let { action, dispatch, interval, history, poll } = this.props;

    if (isEmpty(history)) {
      dispatch(action)
    }

    this.interval = poll &&
      dispatch(timing.setInterval(action, interval));
  }

  componentWillUnmount () {
    let { dispatch, poll } = this.props;

    this.interval &&
      dispatch(this.interval.commands.stop);
  }

  render () {
    const { children, history, wait } = this.props;

    return (
      wait && isEmpty(history) ? <CircularProgress /> : children
    )
  }
}

export default connect(connector)(APIPoll);
