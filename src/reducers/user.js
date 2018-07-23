import { USER_SET, UNSER_UNSET, PICTURE_SET } from '../actionTypes/user'

const initialState = {
  username: null,
  access_token: null,
  sso_token: null,
  profile_picture: null
}

const reducer = function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_SET:
      return {
        username: action.token.user.username,
        access_token: action.token.access_token,
        sso_token: action.token.sso_token,
        profile_picture: null

      }

    case UNSER_UNSET:
      return {
        username: null,
        access_token: null,
        sso_token: null,
        profile_picture: null,
      }

    case PICTURE_SET:
      return {
        ...state,
        profile_picture: action.picture,
      }
    default:
      return state
  }
}

export default reducer