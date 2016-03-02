import get from 'lodash/get';

export default function select(namespace, selector, state, key) {
  if (arguments.length < 4) {
    return select.bind(this, namespace, selector, state);
  }

  return (selector || get)(get(state, namespace), key);
}
