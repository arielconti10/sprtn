import { USER_SET, UNSER_UNSET, PICTURE_SET, GET_PERMISSIONS,
    USER_CREATING,
    USER_CREATE_SUCCESS,
    USER_CREATE_ERROR,
    USER_REQUESTING,
    USER_REQUEST_SUCCESS,
    USER_LOAD_SUCCESS,
    USER_LOADING,
    USER_REQUEST_ERROR,
    USER_UPDATE_SUCCESS,
    ROLE_LIST_FLOW,
    SET_ROLES,
    CHANGE_ROLE_FLOW,
    SET_ROLE_ID,
    GET_SUBSIDIARIES_FLOW,
    SET_SUBSIDIARIES,
    CHANGE_SUBSIDIARY_FLOW,
    SET_SUBSIDIARY_ID,
    SET_SECTORS,
    CHANGE_SECTOR_FLOW,
    SET_SECTOR_ID,
    UPDATE_LOADER,
    CHANGE_STATUS_FLOW,
    SET_STATUS,
    SEARCH_BY_NAME_FLOW,
    SET_SUPERIOR_LIST,
    SUPERIOR_UPDATE_FLOW,
    UNLOAD_USER
} from '../actionTypes/user'

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
  list: [], // where we'll store users
  current_user: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [], 
  subsidiary_id: {},
  sector_id: {}
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

    case USER_CREATING:
    return {
      ...state,
      requesting: true,
      successful: false,
      messages: [{
        body: `user: ${action.user.name} being created...`,
        time: new Date(),
      }],
      errors: [],
    }

    // On success include the new user into our list
  case USER_CREATE_SUCCESS:
    return {
      list: state.list.concat([action.user]),
      requesting: false,
      successful: true,
      messages: [{
        body: `user: ${action.user.name} awesomely created!`,
        time: new Date(),
      }],
      errors: [],
    }

  case USER_CREATING:
    return {
      ...state,
      requesting: true,
      successful: false,
      messages: [{
        body: `user: ${action.user.name} being updated...`,
        time: new Date(),
      }],
      errors: [],
    }

  case USER_UPDATE_SUCCESS:
    return {
      ...state,
      requesting: false,
      successful: true,
      messages: [{
        body: `user: ${action.user.name} updated!`,
        time: new Date(),
      }],
      errors: [],
    }
    

  case USER_CREATE_ERROR:
    return {
      ...state,
      requesting: false,
      successful: false,
      messages: [],
      errors: state.errors.concat([{
        body: action.error.toString(),
        time: new Date(),
      }]),
    }

  case USER_REQUESTING:
    return {
      ...state, // ensure that we don't erase fetched ones
      requesting: false,
      successful: true,
      messages: [{
        body: 'Fetching users...!',
        time: new Date(),
      }],
      errors: [],
    }

  case USER_LOADING:
    return {
      ...state,
      current_user: null,
      requesting: false,
      successful: true,
      messages: [{
        body: 'Fetching current user',
        time: new Date()
      }],
      errors: []
    }

  case USER_LOAD_SUCCESS:
    const userSearch = action.userSearch;
    state.subsidiary_id = userSearch.subsidiary_id;
    state.sector_id = userSearch.sector_id;
    state.role_id = userSearch.role_id;

    const active = userSearch.deleted_at?0:1;

    return {
        ...state,
        userSearch,
        active
    }

  case USER_REQUEST_SUCCESS:
    return {
      list: action.users, // replace with fresh list
      requesting: false,
      successful: true,
      messages: [{
        body: 'users awesomely fetched!',
        time: new Date(),
      }],
      errors: [],
    }

  case USER_REQUEST_ERROR:
    return {
      requesting: false,
      successful: false,
      messages: [],
      errors: state.errors.concat([{
        body: action.error.toString(),
        time: new Date(),
      }]),
    }

    case ROLE_LIST_FLOW: 
        return {
            ...state
        }
    case SET_ROLES:
        const roles = action.roles;
        return {
            ...state,
            roles
        }
    case CHANGE_ROLE_FLOW:
        return {
            ...state
        }
    case SET_ROLE_ID:
        const role_id = action.role_id;
        return {
            ...state,
            role_id
        }
    case GET_SUBSIDIARIES_FLOW:
        return {
            ...state
        }
    case SET_SUBSIDIARIES:
        const subsidiaries = action.subsidiaries;

        return {
            ...state,
            subsidiaries
        }
    case CHANGE_SUBSIDIARY_FLOW:
        return {
            ...state
        }
    case SET_SUBSIDIARY_ID:
        const subsidiary_id = action.subsidiary_id;
        return {
            ...state,
            subsidiary_id
        }
    case SET_SECTORS:
        const sectors = action.sectors;
        return {
            ...state,
            sectors
        }
    case CHANGE_SECTOR_FLOW:
        return {
            ...state
        }
    case SET_SECTOR_ID:
        const sector_id = action.sector_id;

        return {
            ...state,
            sector_id
        }
    case UPDATE_LOADER:
        const ringLoad = action.ringLoad;
        return {
            ...state,
            ringLoad
        }
    case CHANGE_STATUS_FLOW:
        return {
            ...state
        }
    case SET_STATUS:
        state.active = action.status;

        return {
            ...state
        }
    case SEARCH_BY_NAME_FLOW:
        return {
            ...state
        }
    case SET_SUPERIOR_LIST:
        const superiors = action.superiors;

        return {
            ...state,
            superiors
        }
    case SUPERIOR_UPDATE_FLOW:
        return {
            ...state
        }
    case UNLOAD_USER:
        state.userSearch = {};
        state.subsidiary_id = [];
        state.sector_id = [];
        state.role_id = [];
        return {
            ...state
        }
    default:
      return state
  }
}

export default reducer