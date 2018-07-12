import { LOGIN_REQUESTING } from '../actionTypes/login'

const signupRequest = function signupRequest ({ email, password }) {  
  return {
    type: SIGNUP_REQUESTING,
    email,
    password,
  }
}

export default signupRequest  