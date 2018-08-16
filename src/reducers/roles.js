import {
    ROLE_CREATING,
    ROLE_CREATE_SUCCESS,
    ROLE_CREATE_ERROR,
    ROLE_REQUESTING,
    ROLE_REQUEST_SUCCESS,
    ROLE_LOAD_SUCCESS,
    ROLE_LOADING,
    ROLE_REQUEST_ERROR,
    ROLE_UPDATE_SUCCESS,
    UNLOAD_ROLE
  } from '../actionTypes/roles'
  
  const initialState = {
    list: [], // where we'll store roles
    current_role: null,
    requesting: false,
    successful: false,
    messages: [],
    errors: [],
  }
  
  const reducer = function roleReducer(state = initialState, action) {
    switch (action.type) {
      case ROLE_CREATING:
        return {
          ...state,
          requesting: true,
          successful: false,
          messages: [{
            body: `role: ${action.role.name} being created...`,
            time: new Date(),
          }],
          errors: [],
        }
  
        // On success include the new role into our list
      case ROLE_CREATE_SUCCESS:
        return {
          list: state.list.concat([action.role]),
          requesting: false,
          successful: true,
          messages: [{
            body: `role: ${action.role.name} awesomely created!`,
            time: new Date(),
          }],
          errors: [],
        }
  
      case ROLE_CREATING:
        return {
          ...state,
          requesting: true,
          successful: false,
          messages: [{
            body: `role: ${action.role.name} being updated...`,
            time: new Date(),
          }],
          errors: [],
        }
  
      case ROLE_UPDATE_SUCCESS:
        return {
          ...state,
          requesting: false,
          successful: true,
          messages: [{
            body: `role: ${action.role.name} updated!`,
            time: new Date(),
          }],
          errors: [],
        }
        
  
      case ROLE_CREATE_ERROR:
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
  
      case ROLE_REQUESTING:
        return {
          ...state, // ensure that we don't erase fetched ones
          requesting: false,
          successful: true,
          messages: [{
            body: 'Fetching roles...!',
            time: new Date(),
          }],
          errors: [],
        }
  
      case ROLE_LOADING:
        return {
          ...state,
          current_role: null,
          requesting: false,
          successful: true,
          messages: [{
            body: 'Fetching current role',
            time: new Date()
          }],
          errors: []
        }
  
      case ROLE_LOAD_SUCCESS:
        return {
          current_role: {
            id: action.role.data.id,
            name: action.role.data.name,
            code: action.role.data.code,
            active: action.role.data.deleted_at !== null ? false : true
          }, // replace with fresh list
          requesting: false,
          successful: true,
          messages: [{
            body: 'current role awesomely fetched!',
            time: new Date(),
          }],
          errors: [],
        }
  
      case ROLE_REQUEST_SUCCESS:
        return {
          list: action.roles, // replace with fresh list
          requesting: false,
          successful: true,
          messages: [{
            body: 'roles awesomely fetched!',
            time: new Date(),
          }],
          errors: [],
        }
  
      case ROLE_REQUEST_ERROR:
        return {
          requesting: false,
          successful: false,
          messages: [],
          errors: state.errors.concat([{
            body: action.error.toString(),
            time: new Date(),
          }]),
        }

        case UNLOAD_ROLE:
            state.current_role = {};
            return {
                ...state
            }
  
      default:
        return state
    }
  }
  
  export default reducer