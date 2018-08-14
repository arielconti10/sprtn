import {
  DISCIPLINE_CREATING,
  DISCIPLINE_CREATE_SUCCESS,
  DISCIPLINE_CREATE_ERROR,
  DISCIPLINE_REQUESTING,
  DISCIPLINE_REQUEST_SUCCESS,
  DISCIPLINE_LOAD_SUCCESS,
  DISCIPLINE_LOADING,
  DISCIPLINE_REQUEST_ERROR,
  DISCIPLINE_UPDATING,
  DISCIPLINE_UPDATE_SUCCESS,
  DISCIPLINE_CURRENT_CLEAR
} from '../actionTypes/discipline'

const initialState = {
  list: [], 
  current_discipline: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function disciplineReducer(state = initialState, action) {
  switch (action.type) {
    case DISCIPLINE_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_discipline: null,
        messages: [{
          body: `discipline: ${action.discipline.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case DISCIPLINE_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.discipline]),
        requesting: false,
        successful: true,
        messages: [{
          body: `discipline: ${action.discipline.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case DISCIPLINE_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `discipline: ${action.discipline.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case DISCIPLINE_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `discipline: ${action.discipline.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case DISCIPLINE_CREATE_ERROR:
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

    case DISCIPLINE_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_discipline: null,        
        messages: [{
          body: 'Fetching discipline...!',
          time: new Date(),
        }],
        errors: [],
      }

    case DISCIPLINE_LOADING:
      return {
        ...state,
        current_discipline: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current discipline',
          time: new Date()
        }],
        errors: []
      }

    case DISCIPLINE_LOAD_SUCCESS:
      return {
        current_discipline: {
          id: action.discipline.data.id,
          name: action.discipline.data.name,
          code: action.discipline.data.code,
          active: action.discipline.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current discipline awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case DISCIPLINE_REQUEST_SUCCESS:
      return {
        list: action.disciplines, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'disciplines awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case DISCIPLINE_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case DISCIPLINE_CURRENT_CLEAR:
        return {
            current_discipline: null,
        }

    default:
      return state
  }
}

export default reducer