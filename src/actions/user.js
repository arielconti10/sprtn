import { USER_SET, PICTURE_SET, USER_UNSET, GET_PERMISSIONS } from '../actionTypes/user';

export function setUser(token) {
  return {
    type: USER_SET,
    token,
  }
}

export function setUserPicture(picture) {
  return { 
    type: PICTURE_SET,
    picture
  }
}

export function unsetUser() {
  return {
    type: USER_UNSET,
  }
}

export function permissionsRequest(nav_itens) {

  return {
    type: GET_PERMISSIONS,
    nav_itens
  }
}