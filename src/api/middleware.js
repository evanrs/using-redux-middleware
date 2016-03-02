// Njg5ODg
import defaultsDeep from "lodash/defaultsDeep";
import set from "lodash/set";
import isString from "lodash/isString";

import UUID from "node-uuid";

import * as actions from './actions';
import { selectAuthorization } from './reducer';
import * as API from './constants';


export function APIMiddleware ({dispatch, getState}) {
  const dispatchUpdate = (action, update) =>
    dispatch(defaultsDeep(update, action))
  ;

  return (next) => (action) => {
    if (action.type !== API.FETCH) {
      return next(action);
    }

    debugger;

    switch(action.status) {
      case undefined:
        return dispatchUpdate(action, {
          id: UUID.v1(),
          status: API.QUEUED,
          request: {
            headers: {
              // authorization: selectAuthorization(getState())
            }
          }
        })

      case API.QUEUED: {
        let { url, body, ...options } = action.request;

        dispatchUpdate(action, {
          status: API.PENDING
        });

        if (! /get/i.test(options.method)) {
          options.body =
            isString(body) ? body : JSON.stringify(body);
        }

        return fetch(url, options).then((response) =>
          response.clone().json().
            then((json) =>
              dispatchUpdate(action, {
                status: API.RESOLVED,
                response: {
                  ok: response.ok,
                  status: response.status,
                  data: json
                }
              })
          )).
          catch(() =>
            dispatchUpdate(action, {
              status: API.RESOLVED,
              response: {
                ok: false
              }
            })
          )
        ;
      }

      case API.RESOLVED:
        return action.response.ok ?
          dispatchUpdate(action, { status: API.SUCCESS })
        : action.meta.retry ?
          dispatchUpdate(action, {
            status: API.ERROR,
            meta: {
              command: {
                retry: {
                  ...action, status: API.QUEUED }
              }
            }
          })
        : dispatchUpdate(action, { status: API.RETRY })

      case API.RETRY:
        return dispatchUpdate(action, { status: API.QUEUED, meta: { retry: true } })
    }

    return next(action);
  }
}
