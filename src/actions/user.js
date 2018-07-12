import { USER_SET, USER_UNSET } from '../actionTypes/user';

export function setUser(token) {
  return {
    type: USER_SET,
    token,
  }
}

export function unsetUser() {
  return {
    type: USER_UNSET,
  }
}