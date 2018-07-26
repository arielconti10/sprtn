import { USER_SET, UNSER_UNSET, PICTURE_SET, GET_PERMISSIONS } from '../actionTypes/user'

const initialState = {
  username: null,
  full_name: null,
  email: null,
  superior: null,
  access_token: null,
  sso_token: null,
  role_name: null,
  profile_picture: null,
  nav_itens: null, 
}

const reducer = function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_SET:
      return {
        ...state,
        username: action.token.user.username,
        full_name: action.token.user.full_name,
        role_name: action.token.user.role_name,
        email: action.token.user.email,
        superior: action.token.user.superior_name,
        access_token: action.token.access_token,
        sso_token: action.token.sso_token,
        role_name: action.token.user.role.name,
      }

    case UNSER_UNSET:
      return {
        username: null,
        access_token: null,
        sso_token: null,
        profile_picture: null,
        nav_itens: null, 
      }

    case PICTURE_SET:
      return {
        ...state,
        profile_picture: action.picture,
      }

    case GET_PERMISSIONS: {
      return {
        ...state,
        nav_itens: action.nav_itens,
      }
    }
    default:
      return state
  }
}

export default reducer