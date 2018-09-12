import {
  INDICATORS_REQUESTING,
  INDICATORS_REQUEST_SUCCESS,
  INDICATORS_REQUEST_ERROR,
  CHANGE_HIERARCHY_REQUESTING,
  CHANGE_HIERARCHY_SUCCESS,
  UPDATE_RING_LOAD,
} from '../actionTypes/indicators'

const initialState = {
  contributors: {},
  schools: [],
  contacts: null,
  total_action: null,
  coverage: [],
  schoolTypes: [],
  studentTypes: [],
  total_schools: 0,
  total_students: 0,
  dataSchoolTypes: [],
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


    case CHANGE_HIERARCHY_REQUESTING:
      return {
        ...state,
        requesting: true,
        successful: false,
        message: [{
          body: 'Updating hierarchy',
          time: new Date(),
        }],
        errors: [],
      }
    case INDICATORS_REQUEST_SUCCESS:
      return {
        dataActions: action.dataActions,          
        actions: action.actions.data,
        actionTypes: action.actionTypes.data,
        contributors: action.indicators.data, // replace with fresh list
        schools: action.schools,
        schoolTypes: action.schoolTypes.data,
        studentTypes: action.studentTypes.data.total,
        contacts: action.contacts.data.total,
        coverage: action.coverage.data,
        total_schools: action.total_schools,
        total_action: action.total_action.data,
        total_students: action.total_students,
        dataSchoolTypes: action.dataSchoolTypes,
        dataCoverage: action.dataCoverage,
        dataActionTypes: action.dataActionTypes,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Indicators awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case CHANGE_HIERARCHY_SUCCESS:
    console.log(action)
      return {
        ...state,
        actions: action.actions.data,
        actionTypes: action.actionTypes.data,
        schoolTypes: action.schoolTypes.data,
        contacts: action.contacts.data.total,
        studentTypes: action.studentTypes.data.total,
        total_schools: action.total_schools,
        total_students: action.total_students,
        total_action: action.total_action.data,
        dataActions: action.dataActions,      
        dataSchoolTypes: action.dataSchoolTypes,
        dataActionTypes: action.dataActionTypes,
        // dataCoverage: action.dataCoverage,
        messages: [{
          body: 'Indicators updated!',
          time: new Date(),
        }],
        errors: [],
      }

    case INDICATORS_REQUEST_ERROR:
      console.log(action)
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat[{
          body: action.error.toString(),
          time: new Date(),
        }],
      }

    case UPDATE_RING_LOAD:
      const ring_load = action.ring_load;
      return {
        ...state,
        ring_load
      }
    default:
      return state
  }
}

export default reducer