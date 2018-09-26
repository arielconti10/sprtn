import {
  LEVEL_CREATING,
  LEVEL_CREATE_SUCCESS,
  LEVEL_CREATE_ERROR,
  LEVEL_REQUESTING,
  LEVEL_REQUEST_SUCCESS,
  LEVEL_LOAD_SUCCESS,
  LEVEL_LOADING,
  LEVEL_REQUEST_ERROR,
  LEVEL_UPDATING,
  LEVEL_UPDATE_SUCCESS,
  LEVEL_CURRENT_CLEAR,
} from '../actionTypes/level'

const initialState = {
  list: [],
  current_level: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function levelReducer(state = initialState, action) {
  switch (action.type) {
    case LEVEL_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_level: null,
        messages: [{
          body: `level: ${action.level.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case LEVEL_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.level]),
        requesting: false,
        successful: true,
        messages: [{
          body: `level: ${action.level.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case LEVEL_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `level: ${action.level.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case LEVEL_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `level: ${action.level.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }


    case LEVEL_CREATE_ERROR:
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

    case LEVEL_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_level: null,
        messages: [{
          body: 'Fetching level...!',
          time: new Date(),
        }],
        errors: [],
      }

    case LEVEL_LOADING:
      return {
        ...state,
        current_level: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current level',
          time: new Date()
        }],
        errors: []
      }


    case LEVEL_LOAD_SUCCESS:
      return {
        current_level: {
          id: action.level.data.id,
          name: action.level.data.name,
          code: action.level.data.code,
          active: action.level.data.deleted_at !== null ? false : true,
          disciplines: action.level.data.disciplines,
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current level awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case LEVEL_REQUEST_SUCCESS:
      return {
        list: action.levels.data, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'levels awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case LEVEL_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

    case LEVEL_CURRENT_CLEAR:
      return {
        current_level: null,
      }

    default:
      return state
  }
}

export default reducer