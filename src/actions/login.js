import {
  LOGIN_REQUESTING,
  UPDATE_LOADER_LOGIN
} from '../actionTypes/login'

// In order to perform an action of type LOGIN_REQUESTING
// we need an username and password
const loginRequest = function loginRequest ({ username, password }) {
  return {
    type: LOGIN_REQUESTING,
    username,
    password,
  }
}

export function updateLoader(ringLoad) {
    return {
        type: UPDATE_LOADER_LOGIN,
        ringLoad
    }
}

// Since it's the only one here
export default loginRequest
