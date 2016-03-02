import configureStore from './configureStore';

let state = {};
try {
  state = JSON.parse(localStorage.getItem('store') || '{}') || {};
} catch (e) {}

const store = configureStore(state);

export default store;
