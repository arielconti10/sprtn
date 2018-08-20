import {
  JOB_TITLE_CREATING,
  JOB_TITLE_CREATE_SUCCESS,
  JOB_TITLE_CREATE_ERROR,
  JOB_TITLE_REQUESTING,
  JOB_TITLE_REQUEST_SUCCESS,
  JOB_TITLE_LOAD_SUCCESS,
  JOB_TITLE_LOADING,
  JOB_TITLE_REQUEST_ERROR,
  JOB_TITLE_UPDATING,
  JOB_TITLE_UPDATE_SUCCESS,
  JOB_TITLE_CURRENT_CLEAR
} from '../actionTypes/job_title'

const initialState = {
  list: [], 
  current_job_title: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function job_titleReducer(state = initialState, action) {
  switch (action.type) {
    case JOB_TITLE_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_job_title: null,
        messages: [{
          body: `job_title: ${action.job_title.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case JOB_TITLE_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.job_title]),
        requesting: false,
        successful: true,
        messages: [{
          body: `job_title: ${action.job_title.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case JOB_TITLE_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `job_title: ${action.job_title.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case JOB_TITLE_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `job_title: ${action.job_title.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case JOB_TITLE_CREATE_ERROR:
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

    case JOB_TITLE_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_job_title: null,        
        messages: [{
          body: 'Fetching job_title...!',
          time: new Date(),
        }],
        errors: [],
      }

    case JOB_TITLE_LOADING:
      return {
        ...state,
        current_job_title: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current job_title',
          time: new Date()
        }],
        errors: []
      }

    case JOB_TITLE_LOAD_SUCCESS:

      return {
        current_job_title: {
          id: action.job_title.data.id,
          name: action.job_title.data.name,
          code: action.job_title.data.code,
          job_title_type_id: action.job_title.data.job_title_type_id,
          active: action.job_title.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current job_title awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case JOB_TITLE_REQUEST_SUCCESS:
      return {
        list: action.job_titles, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'job_titles awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case JOB_TITLE_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case JOB_TITLE_CURRENT_CLEAR:
        return {
            current_job_title: null,
        }

    default:
      return state
  }
}

export default reducer