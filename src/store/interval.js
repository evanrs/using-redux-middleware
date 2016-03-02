import merge from "lodash/merge";

import UUID from "node-uuid";

const SET_INTERVAL = "SET_INTERVAL";
const UNSET_INTERVAL = "UNSET_INTERVAL";
const INTERVAL = "INTERVAL";

const intervalId = {}

export function intervalMiddleware ({dispatch, getState}) {
  return (next) => (action) => {
    let { type, meta } = action;

    if (action.type === SET_INTERVAL) {
      let { duration, payload, ...source } = action;

      intervalId[action.id] =
        global.setInterval(
          dispatch.bind(null, {
            type: INTERVAL, ...payload, source }),
          duration
        )
      ;
    }

    if (action.type === UNSET_INTERVAL) {
      global.clearInterval(intervalId[action.id]);
    }

    return next(action);
  }
}

export function setInterval (action, duration) {
  let id = UUID.v1();

  return {
    id,
    type: SET_INTERVAL,
    duration: duration > 100 ? duration : 100,
    payload: action,
    commands: {
      stop: {
        type: UNSET_INTERVAL,
        id
      }
    }
  }
}
