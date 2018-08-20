import {
  SECTOR_CREATING,
  SECTOR_CREATE_SUCCESS,
  SECTOR_CREATE_ERROR,
  SECTOR_REQUESTING,
  SECTOR_REQUEST_SUCCESS,
  SECTOR_LOAD_SUCCESS,
  SECTOR_LOADING,
  SECTOR_REQUEST_ERROR,
  SECTOR_UPDATING,
  SECTOR_UPDATE_SUCCESS,
  SECTOR_CURRENT_CLEAR
} from '../actionTypes/sector'

const initialState = {
  list: [], 
  current_sector: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function sectorReducer(state = initialState, action) {
  switch (action.type) {
    case SECTOR_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_sector: null,
        messages: [{
          body: `sector: ${action.sector.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case SECTOR_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.sector]),
        requesting: false,
        successful: true,
        messages: [{
          body: `sector: ${action.sector.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case SECTOR_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `sector: ${action.sector.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case SECTOR_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `sector: ${action.sector.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case SECTOR_CREATE_ERROR:
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

    case SECTOR_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_sector: null,        
        messages: [{
          body: 'Fetching sector...!',
          time: new Date(),
        }],
        errors: [],
      }

    case SECTOR_LOADING:
      return {
        ...state,
        current_sector: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current sector',
          time: new Date()
        }],
        errors: []
      }

    case SECTOR_LOAD_SUCCESS:
      return {
        current_sector: {
          id: action.sector.data.id,
          name: action.sector.data.name,
          code: action.sector.data.code,
          active: action.sector.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current sector awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SECTOR_REQUEST_SUCCESS:
      return {
        list: action.sectors, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'sectors awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SECTOR_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case SECTOR_CURRENT_CLEAR:
        return {
            current_sector: null,
        }

    default:
      return state
  }
}

export default reducer