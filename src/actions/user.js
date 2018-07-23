import { USER_SET, PICTURE_SET, USER_UNSET } from '../actionTypes/user';

export function setUser(token) {
  return {
    type: USER_SET,
    token,
  }
}

export function setUserPicture(picture) {
  console.log(picture)
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