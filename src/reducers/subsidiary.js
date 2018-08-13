import {
  SUBSIDIARY_CREATING,
  SUBSIDIARY_CREATE_SUCCESS,
  SUBSIDIARY_CREATE_ERROR,
  SUBSIDIARY_REQUESTING,
  SUBSIDIARY_REQUEST_SUCCESS,
  SUBSIDIARY_LOAD_SUCCESS,
  SUBSIDIARY_LOADING,
  SUBSIDIARY_REQUEST_ERROR,
  SUBSIDIARY_UPDATING,
  SUBSIDIARY_UPDATE_SUCCESS,
  SUBSIDIARY_CURRENT_CLEAR
} from '../actionTypes/subsidiary'

const initialState = {
  list: [], 
  current_subsidiary: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function subsidiaryReducer(state = initialState, action) {
  switch (action.type) {
    case SUBSIDIARY_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_subsidiary: null,
        messages: [{
          body: `subsidiary: ${action.subsidiary.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case SUBSIDIARY_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.subsidiary]),
        requesting: false,
        successful: true,
        messages: [{
          body: `subsidiary: ${action.subsidiary.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case SUBSIDIARY_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `subsidiary: ${action.subsidiary.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case SUBSIDIARY_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `subsidiary: ${action.subsidiary.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case SUBSIDIARY_CREATE_ERROR:
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

    case SUBSIDIARY_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_subsidiary: null,        
        messages: [{
          body: 'Fetching subsidiary...!',
          time: new Date(),
        }],
        errors: [],
      }

    case SUBSIDIARY_LOADING:
      return {
        ...state,
        current_subsidiary: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current subsidiary',
          time: new Date()
        }],
        errors: []
      }

    case SUBSIDIARY_LOAD_SUCCESS:
      console.log(action.subsidiary)
      return {
        current_subsidiary: {
          id: action.subsidiary.data.id,
          name: action.subsidiary.data.name,
          code: action.subsidiary.data.code,
          sectors: action.subsidiary.data.sectors,
          active: action.subsidiary.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current subsidiary awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SUBSIDIARY_REQUEST_SUCCESS:
      return {
        list: action.subsidiarys, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'subsidiarys awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SUBSIDIARY_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case SUBSIDIARY_CURRENT_CLEAR:
        return {
            current_subsidiary: null,
        }

    default:
      return state
  }
}

export default reducer