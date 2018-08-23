import { 
    LOAD_CONTACTS_FLOW, SET_CONTACTS_LIST, SET_CONTACTS_COLUMNS, ON_DELETE_CONTACT_FLOW,
    ON_ACTIVE_CONTACT_FLOW, ADD_CONTACT_FLOW, SET_CONTACT_COLLAPSE, LOAD_CONTACT_INITIAL_FLOW,
    SET_CONTACT_JOB_TITLES, SELECT_JOB_FLOW, SET_CONTACT_JOB_TITLE, SET_CONTACT_STATES,
    SELECT_STATE_FLOW, SET_CONTACT_STATE_ID, SEARCH_CEP_FLOW, SET_CONTACT_INFO,
    SET_CONTACT_ERROR, UPDATE_AUTH_EMAIL_FLOW, SET_AUTHORIZE_EMAIL,
    UPDATE_FAVORITE_FLOW, SET_FAVORITE, UNLOAD_CONTACT, CONTACT_CREATE_FLOW
} from '../actionTypes/contact'

const initialState = {
    contactsList: [],
    contactsColumns: [],
    contactAddress: {},
    collapse: false,
    jobTitles: [],
    authorizeEmail: true,
    favorite: true
}

const reducer = function contactReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CONTACTS_FLOW:
        return {
            ...state
        }
    case SET_CONTACTS_LIST:
        const contactsList = action.contactsList;
        return {
            ...state,
            contactsList
        }
    case SET_CONTACTS_COLUMNS:
        const contactsColumns = action.contactsColumns;
        return {
            ...state,
            contactsColumns
        }
    case ON_DELETE_CONTACT_FLOW:
        return {
            ...state
        }
    case ON_ACTIVE_CONTACT_FLOW:
        return {
            ...state
        }
    case ADD_CONTACT_FLOW:
        return {
            ...state
        }
    case SET_CONTACT_COLLAPSE:
        const collapse = action.collapse;
        return {
            ...state,
            collapse
        }
    case LOAD_CONTACT_INITIAL_FLOW:
        return {
            ...state
        }
    case SET_CONTACT_JOB_TITLES:
        const jobTitles = action.jobTitles;
        return {
            ...state,
            jobTitles
        }
    case SELECT_JOB_FLOW:
        return {
            ...state
        }
    case SET_CONTACT_JOB_TITLE:
        const jobTitleId = action.jobTitleId;
        return {
            ...state,
            jobTitleId
        }
    case SET_CONTACT_STATES:
        const states = action.states;
        return {
            ...state,
            states
        }
    case SELECT_STATE_FLOW:
        return {
            ...state
        }
    case SET_CONTACT_STATE_ID:
        const stateId = action.stateId;
        return {
            ...state,
            stateId
        }
    case SEARCH_CEP_FLOW:
        return {
            ...state
        }
    case SET_CONTACT_INFO:
        const contactAddress = action.contactInfo;

        return {
            ...state,
            contactAddress
        }
    case SET_CONTACT_ERROR:
        const contactError = action.contactError;
        return {
            ...state,
            contactError
        }
    case UPDATE_AUTH_EMAIL_FLOW:
        return {
            ...state
        }
    case SET_AUTHORIZE_EMAIL:
        const authorizeEmail = action.authorizeEmail;
        return {
            ...state,
            authorizeEmail
        }
    case UPDATE_FAVORITE_FLOW:
        return {
            ...state
        }
    case SET_FAVORITE:
        const favorite = action.favorite;
        return {
            ...state,
            favorite
        }
    case UNLOAD_CONTACT:
        state.contactInfo = {};
        state.contactAddress = {};
        state.jobTitleId = '';
        state.stateId = '';
        
        return {
            ...state
        }
    case CONTACT_CREATE_FLOW: 
        return {
            ...state
        }
    default:
      return state
  }
}

export default reducer