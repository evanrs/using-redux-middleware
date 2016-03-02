import { SEARCH } from "../constants";

export function search (query) {
  return {
    type: SEARCH,
    payload: query
  }
}
