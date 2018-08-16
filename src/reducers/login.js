import {
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  UPDATE_LOADER_LOGIN
} from '../actionTypes/login'

const initialState = {
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
  valid_login: false,
}
const reducer = function loginReducer (state = initialState, action) {
  switch (action.type) {
    // Set the requesting flag and append a message to be shown
    case LOGIN_REQUESTING:
      return {
        requesting: true,
        successful: false,
        messages: [{ body: 'Logging in...', time: new Date() }],
        errors: [],
      }

    // Successful?  Reset the login state.
    case LOGIN_SUCCESS:
      return {
        errors: [],
        messages: [],
        requesting: false,
        successful: true,
        valid_login: true,
      }

    // Append the error returned from our api
    // set the success and requesting flags to false
    case LOGIN_ERROR:
      return {
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
        messages: [],
        requesting: false,
        successful: false,
      }

    case UPDATE_LOADER_LOGIN:
      const ringLoad = action.ringLoad;
      return {
          ...state,
          ringLoad
      }

    default:
      return state
  }
}

export default reducer
