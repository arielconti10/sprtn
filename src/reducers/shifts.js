import {
  SHIFT_CREATING,
  SHIFT_CREATE_SUCCESS,
  SHIFT_CREATE_ERROR,
  SHIFT_REQUESTING,
  SHIFT_REQUEST_SUCCESS,
  SHIFT_LOAD_SUCCESS,
  SHIFT_LOADING,
  SHIFT_REQUEST_ERROR,
  SHIFT_UPDATE_SUCCESS,
} from '../actionTypes/shifts'

const initialState = {
  list: [], // where we'll store shifts
  current_shift: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function shiftReducer(state = initialState, action) {
  switch (action.type) {
    case SHIFT_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `shift: ${action.shift.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }

      // On success include the new shift into our list
    case SHIFT_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.shift]),
        requesting: false,
        successful: true,
        messages: [{
          body: `shift: ${action.shift.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case SHIFT_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `shift: ${action.shift.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case SHIFT_UPDATE_SUCCESS:
      return state.map((shift) => {
        if (shift.id == action.shift.id) {
          return {
            ...shift,
          }
        } else {
          return shift
        }
      })


    case SHIFT_CREATE_ERROR:
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

    case SHIFT_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching shifts...!',
          time: new Date(),
        }],
        errors: [],
      }

    case SHIFT_LOADING:
      return {
        ...state,
        current_shift: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current shift',
          time: new Date()
        }],
        errors: []
      }

    case SHIFT_LOAD_SUCCESS:
      return {
        current_shift: action.shift.data, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current shift awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SHIFT_REQUEST_SUCCESS:
      return {
        list: action.shifts, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'shifts awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case SHIFT_REQUEST_ERROR:
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