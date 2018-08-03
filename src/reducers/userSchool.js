import { 
    LOAD_USER_SCHOOL, SET_USERS, SET_MESSAGE_ERROR, CHANGE_USER_FLOW, SET_USER_ID, SET_SUBSIDIARIES, CHANGE_SUBSIDIARY_FLOW,
    SET_SUBSIDIARY_ID, SET_SECTORS, CHANGE_SECTOR_FLOW, SET_SCHOOL_TYPE, CHANGE_SCHOOL_TYPE, SET_SCHOOL_TYPE_ID,
    SET_SECTOR_ID, SET_SCHOOLS, UPDATE_LOADER, SELECT_OPTION_FLOW, UPDATE_TOTAL_SELECTED, SET_WALLET_SCHOOLS,
    SELECT_WALLET_OPTION, UPDATE_WALLET_SELECTED, SELECT_SCHOOL_FLOW, REMOVE_WALLET_OPTION_FLOW
} from '../actionTypes/userSchool'

const initialState = {
    data_year: null
}

const reducer = function userSchoolReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER_SCHOOL:
        return {
            ...state
        };
    case SET_USERS:
        const users = action.users;

        return {
            ...state,
            users
        }
    case SET_MESSAGE_ERROR:
        const back_error = action.back_error
        return {
            ...state,
            back_error
        }
    case CHANGE_USER_FLOW:
        return {
            ...state
        }
    case SET_USER_ID:
        const user_id = action.user_id;
        return {
            ...state,
            user_id
        }
    case SET_SUBSIDIARIES:
        const subsidiaries = action.subsidiaries;
        return {
            ...state,
            subsidiaries
        }
    case CHANGE_SUBSIDIARY_FLOW:
        return {
            ...state
        }
    case SET_SUBSIDIARY_ID:
        const subsidiary_id = action.subsidiary_id;
        return {
            ...state,
            subsidiary_id
        }
    case SET_SECTORS:
        const sectors = action.sectors;
        return {
            ...state,
            sectors
        }
    case CHANGE_SECTOR_FLOW:
        return {
            ...state,
        }
    case SET_SCHOOL_TYPE:
        const school_types = action.school_types;
        return {
            ...state,
            school_types
        }
    case CHANGE_SCHOOL_TYPE:
        return {
            ...state
        }
    case SET_SCHOOL_TYPE_ID:
        const school_type_id = action.school_type_id;
        return {
            ...state,
            school_type_id
        }
    case SET_SECTOR_ID:
        const sector_id = action.sector_id;
        return {
            ...state,
            sector_id
        }
    case SET_SCHOOLS:
        const schools = action.schools;
        return {
            ...state,
            schools
        }
    case UPDATE_LOADER:
        const ringLoad = action.ringLoad;
        return {
            ...state,
            ringLoad
        }
    case SELECT_OPTION_FLOW:
        return {
            ...state
        }
    case UPDATE_TOTAL_SELECTED:
        const total_selected_available = action.total_selected_available;
        return {
            ...state,
            total_selected_available
        }
    case SET_WALLET_SCHOOLS:
        const wallet_schools = action.wallet_schools;
        return {
            ...state,
            wallet_schools
        }
    case SELECT_WALLET_OPTION:
        return {
            ...state
        }
    case UPDATE_WALLET_SELECTED:
        const total_selected_wallet = action.total_selected_wallet;
        return {
            ...state,
            total_selected_wallet
        }
    case SELECT_SCHOOL_FLOW:
        return {
            ...state
        }
    case REMOVE_WALLET_OPTION_FLOW:
        return {
            ...state
        }
    default:
      return state
  }
}

export default reducer