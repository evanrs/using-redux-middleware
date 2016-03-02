import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';

import globalStyle from "./global.less";

import configureStore from "./configureStore";
import Root from "./containers/Root";


const store = configureStore()


render(
  <Root store={store}/>, document.getElementById('mount'))

module.hot &&
  module.hot.accept('./global.less', () => require('./global.less'));
