import {
  SCHOOL_TYPES_CREATING,
  SCHOOL_TYPES_CREATE_SUCCESS,
  SCHOOL_TYPES_CREATE_ERROR,
  SCHOOL_TYPES_REQUESTING,
  SCHOOL_TYPES_REQUEST_SUCCESS,
  SCHOOL_TYPES_LOAD_SUCCESS,
  SCHOOL_TYPES_LOADING,
  SCHOOL_TYPES_REQUEST_ERROR,
  SCHOOL_TYPES_UPDATE_SUCCESS,
  UNLOAD_SCHOOL_TYPE
} from '../actionTypes/schoolTypes'

const initialState = {
  list: [], // where we'll store schoolTypes
  current_schoolType: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function schoolTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SCHOOL_TYPES_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `schoolType: ${action.schoolType.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }

      // On success include the new schoolType into our list
    case SCHOOL_TYPES_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.schoolType]),
        requesting: false,
        successful: true,
        messages: [{
          body: `schoolType: ${action.schoolType.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case SCHOOL_TYPES_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `schoolType: ${action.schoolType.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case SCHOOL_TYPES_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `schoolType: ${action.schoolType.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case SCHOOL_TYPES_CREATE_ERROR:
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

    case SCHOOL_TYPES_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching schoolTypes...!',
          time: new Date(),
        }],
        errors: [],
      }

    case SCHOOL_TYPES_LOADING:
      return {
        ...state,
        current_schoolType: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current schoolType',
          time: new Date()
        }],
        errors: []
      }

    case SCHOOL_TYPES_LOAD_SUCCESS:

      return {
        current_schoolType: {
          id: action.schoolType.data.id,
          name: action.schoolType.data.name,
          active: action.schoolType.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current schoolType awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SCHOOL_TYPES_REQUEST_SUCCESS:
      return {
        list: action.schoolTypes, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'schoolTypes awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SCHOOL_TYPES_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }
    
    case UNLOAD_SCHOOL_TYPE:
       state.current_schoolType = {};
       return {
          ...state
      }

    default:
      return state
  }
}

export default reducer