import {
  CONGREGATION_CREATING,
  CONGREGATION_CREATE_SUCCESS,
  CONGREGATION_CREATE_ERROR,
  CONGREGATION_REQUESTING,
  CONGREGATION_REQUEST_SUCCESS,
  CONGREGATION_LOAD_SUCCESS,
  CONGREGATION_LOADING,
  CONGREGATION_REQUEST_ERROR,
  CONGREGATION_UPDATING,
  CONGREGATION_UPDATE_SUCCESS,
  CONGREGATION_CURRENT_CLEAR
} from '../actionTypes/congregation'

const initialState = {
  list: [], 
  current_congregation: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function congregationReducer(state = initialState, action) {
  switch (action.type) {
    case CONGREGATION_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_congregation: null,
        messages: [{
          body: `congregation: ${action.congregation.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case CONGREGATION_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.congregation]),
        requesting: false,
        successful: true,
        messages: [{
          body: `congregation: ${action.congregation.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case CONGREGATION_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `congregation: ${action.congregation.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case CONGREGATION_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `congregation: ${action.congregation.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case CONGREGATION_CREATE_ERROR:
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

    case CONGREGATION_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_congregation: null,        
        messages: [{
          body: 'Fetching congregation...!',
          time: new Date(),
        }],
        errors: [],
      }

    case CONGREGATION_LOADING:
      return {
        ...state,
        current_congregation: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current congregation',
          time: new Date()
        }],
        errors: []
      }

    case CONGREGATION_LOAD_SUCCESS:
      return {
        current_congregation: {
          id: action.congregation.data.id,
          name: action.congregation.data.name,
          code: action.congregation.data.code,
          active: action.congregation.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current congregation awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case CONGREGATION_REQUEST_SUCCESS:
      return {
        list: action.congregations, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'congregations awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case CONGREGATION_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case CONGREGATION_CURRENT_CLEAR:
        return {
            current_congregation: null,
        }

    default:
      return state
  }
}

export default reducer