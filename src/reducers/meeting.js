import {
    SET_MEETING_PROFILE_FLOW, SET_MEETING_PROFILE, SET_MEETING_UNIFIED_FLOW, SET_MEETING_UNIFIED,
    CHANGE_MEETING_DATE_FLOW, SET_MEETING_DATE, LOAD_MEETING_SHIFTS_FLOW, SET_MEETING_SHIFTS,
    CHANGE_MEETING_SHIFT_FLOW, SET_MEETING_SHIFT_ID, INSERT_SCHOOL_MEETING_FLOW,
    UNLOAD_SCHOOL_MEETING, SET_MEETING_SUBMITED
} from '../actionTypes/meeting'
  
  const initialState = {
      profileId: '',
      unifiedId: '',
      meetingDate: '',
      shifts: [],
      shiftId: '',
      submited: 0
  }
  
  const reducer = function meetingReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MEETING_PROFILE_FLOW:
            return {
                ...state
            }
        case SET_MEETING_PROFILE:
            const profileId = action.profileId;
            
            return {
                ...state,
                profileId
            }
        case SET_MEETING_UNIFIED_FLOW:
            return {
                ...state
            }
        case SET_MEETING_UNIFIED:
            const unifiedId = action.unifiedId;
            return {
                ...state,
                unifiedId
            }
        case CHANGE_MEETING_DATE_FLOW:
            return {
                ...state
            }
        case SET_MEETING_DATE:
            const meetingDate = action.meetingDate;
            return {
                ...state,
                meetingDate
            }
        case LOAD_MEETING_SHIFTS_FLOW:
            return {
                ...state
            }
        case SET_MEETING_SHIFTS:
            const shifts = action.shifts;
            return {
                ...state,
                shifts
            }
        case CHANGE_MEETING_SHIFT_FLOW:
            return {
                ...state
            }
        case SET_MEETING_SHIFT_ID:
            const shiftId = action.shiftId;
            return {
                ...state,
                shiftId
            }
        case INSERT_SCHOOL_MEETING_FLOW:
            return {
                ...state
            }
        case UNLOAD_SCHOOL_MEETING:
            state.profileId = '';
            state.unifiedId = '';
            state.meetingDate = '';
            state.shiftId = '';
            return {
                ...state
            }
        case SET_MEETING_SUBMITED:
            const submited = 1;
            return {
                ...state,
                submited
            }
        default:
            return state
    }
  }
  
  export default reducer