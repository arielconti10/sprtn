import {
  LOGIN_REQUESTING,
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

// Since it's the only one here
export default loginRequest
