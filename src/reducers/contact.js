import { 
    LOAD_CONTACTS_FLOW, SET_CONTACTS_LIST, SET_CONTACTS_COLUMNS, ON_DELETE_CONTACT_FLOW,
    ON_ACTIVE_CONTACT_FLOW, ADD_CONTACT_FLOW, SET_CONTACT_COLLAPSE, LOAD_CONTACT_INITIAL_FLOW,
    SET_CONTACT_JOB_TITLES, SELECT_JOB_FLOW, SET_CONTACT_JOB_TITLE, SET_CONTACT_STATES,
    SELECT_STATE_FLOW, SET_CONTACT_STATE_ID, SEARCH_CEP_FLOW, SET_ADRESS_INFO,
    SET_CONTACT_ERROR, UPDATE_AUTH_EMAIL_FLOW, SET_AUTHORIZE_EMAIL,
    UPDATE_FAVORITE_FLOW, SET_FAVORITE, UNLOAD_CONTACT, CONTACT_CREATE_FLOW,
    FIND_CONTACT_FLOW, SET_CONTACT_INFO, CONTACT_UPDATE_FLOW, CHANGE_PHONE_FLOW,
    SET_PHONE_TYPE, LOAD_PHONE_DATA_FLOW, SET_PHONE_DATA, ADD_PHONE_FLOW,
    UPDATE_PHONE_FLOW, DELETE_PHONE_FLOW
} from '../actionTypes/contact'

const initialState = {
    contactsList: [],
    contactsColumns: [],
    contactAddress: {},
    collapse: false,
    jobTitles: [],
    authorizeEmail: true,
    favorite: true,
    phoneTypeId: {label: 'Casa', value: 'home'},
    phoneData: []
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
    case SET_ADRESS_INFO:
        const contactAddress = action.adressInfo;

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
        state.phone_number = '';
        state.phoneTypeId = 'home';
        
        return {
            ...state
        }
    case CONTACT_CREATE_FLOW: 
        return {
            ...state
        }
    case FIND_CONTACT_FLOW:
        return {
            ...state
        }
    case SET_CONTACT_INFO:
        const contactInfo = action.contactInfo;
        return {
            ...state,
            contactInfo
        }
    case CONTACT_UPDATE_FLOW:
        return {
            ...state
        }
    case CHANGE_PHONE_FLOW:
        return {
            ...state
        }
    case SET_PHONE_TYPE:
        const phoneTypeId = action.phoneTypeId;
        return {
            ...state,
            phoneTypeId
        }
    case LOAD_PHONE_DATA_FLOW:
        return {
            ...state
        }
    case SET_PHONE_DATA:
        const phoneData = action.phoneData;
        return {
            ...state,
            phoneData
        }
    case ADD_PHONE_FLOW:
        return {
            ...state
        }
    case UPDATE_PHONE_FLOW:
        return {
            ...state
        }
    case DELETE_PHONE_FLOW:
        return {
            ...state
        }
    default:
      return state
  }
}

export default reducer