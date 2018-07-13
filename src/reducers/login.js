import { LOGIN_REQUESTING } from '../actionTypes/login' 

const initalState = {
    requesting: false,
    succesful: false,
    messages: [],
    errors: [],
}

const reducer = function loginReducer (state = initalState, action) {
    switch (action.type) {
        case LOGIN_REQUESTING:
          return {
            requesting: true,
            successful: false,
            messages: [{ body: 'Signing up...', time: new Date() }],
            errors: [],
          }
    
        default:
          return state
      }
    }

export default reducer 