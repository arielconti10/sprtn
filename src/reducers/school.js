import {
    LOAD_SCHOOL_FLOW, SET_SCHOOL, UPDATE_LOADER
} from '../actionTypes/school'
  
  const initialState = {
    schoolInfo: {
        portfolio: 0,
        marketshare: [],
        school_code_totvs: '',
        id: '', 
        name: '', 
        portfolio: '', 
        active: '', 
        total_students_ei: '', 
        total_students_ef1: '', 
        total_students_ef2: '', 
        total_students_em: '', 
        total_students: '', 
        school_type: '', 
        contacts: [], 
        school_code_totvs: '', 
        sector_id: '', 
        subsidiary_id: ''
    }
  }
  
  const reducer = function schoolReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_SCHOOL_FLOW:
            return {
                ...state
            }
        case SET_SCHOOL:
            const schoolInfo = action.school;
            return {
                ...state,
                schoolInfo
            }
        case UPDATE_LOADER:
            const ringLoad = action.ringLoad;
            return {
                ...state,
                ringLoad
            }
      default:
        return state
    }
  }
  
  export default reducer