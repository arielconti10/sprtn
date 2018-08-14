import {
  PROFILE_CREATING,
  PROFILE_CREATE_SUCCESS,
  PROFILE_CREATE_ERROR,
  PROFILE_REQUESTING,
  PROFILE_REQUEST_SUCCESS,
  PROFILE_LOAD_SUCCESS,
  PROFILE_LOADING,
  PROFILE_REQUEST_ERROR,
  PROFILE_UPDATING,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_CURRENT_CLEAR
} from '../actionTypes/profile'

const initialState = {
  list: [], 
  current_profile: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function profileReducer(state = initialState, action) {
  switch (action.type) {
    case PROFILE_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_profile: null,
        messages: [{
          body: `profile: ${action.profile.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case PROFILE_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.profile]),
        requesting: false,
        successful: true,
        messages: [{
          body: `profile: ${action.profile.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case PROFILE_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `profile: ${action.profile.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `profile: ${action.profile.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case PROFILE_CREATE_ERROR:
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

    case PROFILE_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_profile: null,        
        messages: [{
          body: 'Fetching profile...!',
          time: new Date(),
        }],
        errors: [],
      }

    case PROFILE_LOADING:
      return {
        ...state,
        current_profile: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current profile',
          time: new Date()
        }],
        errors: []
      }

    case PROFILE_LOAD_SUCCESS:
      return {
        current_profile: {
          id: action.profile.data.id,
          name: action.profile.data.name,
          code: action.profile.data.code,
          active: action.profile.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current profile awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case PROFILE_REQUEST_SUCCESS:
      return {
        list: action.profiles, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'profiles awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case PROFILE_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case PROFILE_CURRENT_CLEAR:
        return {
            current_profile: null,
        }

    default:
      return state
  }
}

export default reducer