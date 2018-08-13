import {
  LOCALIZATION_CREATING,
  LOCALIZATION_CREATE_SUCCESS,
  LOCALIZATION_CREATE_ERROR,
  LOCALIZATION_REQUESTING,
  LOCALIZATION_REQUEST_SUCCESS,
  LOCALIZATION_LOAD_SUCCESS,
  LOCALIZATION_LOADING,
  LOCALIZATION_REQUEST_ERROR,
  LOCALIZATION_UPDATE_SUCCESS,
} from '../actionTypes/localization'

const initialState = {
  list: [], 
  current_localization: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function localizationReducer(state = initialState, action) {
  switch (action.type) {
    case LOCALIZATION_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `localization: ${action.localization.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case LOCALIZATION_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.localization]),
        requesting: false,
        successful: true,
        messages: [{
          body: `localization: ${action.localization.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case LOCALIZATION_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `LOCALIZATION: ${action.localization.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case LOCALIZATION_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `localization: ${action.localization.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case LOCALIZATION_CREATE_ERROR:
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

    case LOCALIZATION_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching localization...!',
          time: new Date(),
        }],
        errors: [],
      }

    case LOCALIZATION_LOADING:
      return {
        ...state,
        current_localization: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current LOCALIZATION',
          time: new Date()
        }],
        errors: []
      }

    case LOCALIZATION_LOAD_SUCCESS:
      console.log(action.localization)
      return {
        current_localization: {
          id: action.localization.data.id,
          name: action.localization.data.name,
          active: action.localization.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current localization awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case LOCALIZATION_REQUEST_SUCCESS:
      return {
        list: action.LOCALIZATIONs, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'LOCALIZATIONs awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case LOCALIZATION_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

    default:
      return state
  }
}

export default reducer