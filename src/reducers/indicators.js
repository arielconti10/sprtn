import {
  INDICATORS_REQUESTING,
  INDICATORS_REQUEST_SUCCESS,
  INDICATORS_REQUEST_ERROR,
} from '../actionTypes/indicators'

const initialState = {
  contributors: {},
  schools: [],
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function contributorsReducer(state = initialState, action) {
  switch (action.type) {
    case INDICATORS_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching Indicators...!',
          time: new Date(),
        }],
        errors: [],
      }

    case INDICATORS_REQUEST_SUCCESS:
      return {
        ...state,
        contributors: action.indicators.data, // replace with fresh list
        schools: action.schools,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Indicators awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case INDICATORS_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat[{
          body: action.error.toString(),
          time: new Date(),
        }],
      }

    default:
      return state
  }
}

export default reducer