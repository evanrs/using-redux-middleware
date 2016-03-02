import filter from 'lodash/fp/filter';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import omitBy from 'lodash/fp/omitBy';
import mapValues from 'lodash/fp/mapValues';
import reduce from 'lodash/fp/reduce';

export function isEmptyValue (value) {
  return (
    isNil(value) ||
    ( isString(value) ||
      isObjectLike(value) ) &&
      isEmpty(value)
  )
}

export const omitEmpty = omitBy(isEmptyValue);

export const filterEmpty = filter(isEmptyValue);

export const filterEmptyDeep = (obj) =>
  ! isObjectLike(obj) ? obj
  : isArray(obj) ? filterEmpty(obj)
  : omitEmpty(
      mapValues(filterEmptyDeep, obj))
;
