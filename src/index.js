require('react-tap-event-plugin')();
require('babel-polyfill');

import React from 'react';
import { render } from 'react-dom';
import ready from 'document-ready';

import store from './store';
import Root from './containers/Root';

import globalStyle from './global.less';


ready(() =>
  render(
    <Root store={store}/>, document.getElementById('mount')))

module.hot &&
  module.hot.accept('./global.less', () => require('./global.less'));
