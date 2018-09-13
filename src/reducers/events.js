import {
    ADD_EVENT_FLOW, SET_EVENT_COLLAPSE, CHANGE_EVENT_DATE_FLOW, SET_EVENT_DATE, 
    OPEN_START_TIME_FLOW, SET_START_TIME, CHANGE_TYPE_FLOW, SET_TIME,
    GET_EVENT_ACTIONS_FLOW, SET_EVENT_ACTIONS, CHANGE_EVENT_ACTION_FLOW,
    SET_EVENT_ACTION, LOAD_EVENTS_FLOW, SET_SCHOOL_EVENTS,
    DELETE_SCHOOL_EVENT_FLOW, ACTIVE_SCHOOL_EVENT_FLOW, 
    FIND_SCHOOL_EVENT_FLOW, SET_SCHOOL_EVENT_INFO, UPDATE_SCHOOL_EVENT_FLOW,
    INSERT_SCHOOL_EVENT_FLOW, UNLOAD_SCHOOL_EVENT
} from '../actionTypes/event'
  
  const initialState = {
     collapse: false,
     dateStr: '',
     formStartTime: '',
     actionId: '',
     schoolEvents: [],
     eventInfo: {}
  }
  
  const reducer = function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_EVENT_FLOW:
            return {
                ...state
            }
        case SET_EVENT_COLLAPSE:
            const collapse = action.collapse;
            return {
                ...state,
                collapse
            }
        case CHANGE_EVENT_DATE_FLOW:
            return {
                ...state
            }
        case SET_EVENT_DATE:
            const dateStr = action.dateStr;
            return {
                ...state,
                dateStr
            }
        case OPEN_START_TIME_FLOW:
            return {
                ...state
            }
        case SET_START_TIME:
            const formStartTime = action.formStartTime;
            return {
                ...state,
                formStartTime
            }
        case CHANGE_TYPE_FLOW:
            return {
                ...state
            }
        case SET_TIME:
            state.formStartTime = action.formStartTime;

            return {
                ...state
            }
        case GET_EVENT_ACTIONS_FLOW:
            return {
                ...state
            }
        case SET_EVENT_ACTIONS:
            const actions = action.actions;
            return {
                ...state,
                actions
            }
        case CHANGE_EVENT_ACTION_FLOW:
            return {
                ...state
            }
        case SET_EVENT_ACTION:
            const actionId = action.actionId;
            return {
                ...state,
                actionId
            }
        case LOAD_EVENTS_FLOW:
            return {
                ...state
            }
        case SET_SCHOOL_EVENTS:
            const schoolEvents = action.schoolEvents;
            return {
                ...state,
                schoolEvents
            }
        case DELETE_SCHOOL_EVENT_FLOW:
            return {
                ...state
            }
        case ACTIVE_SCHOOL_EVENT_FLOW:
            return {
                ...state
            }
        case FIND_SCHOOL_EVENT_FLOW:
            return {
                ...state
            }
        case SET_SCHOOL_EVENT_INFO:
            const eventInfo = action.eventInfo;
            return {
                ...state,
                eventInfo
            }
        case UPDATE_SCHOOL_EVENT_FLOW:
            return {
                ...state
            }
        case INSERT_SCHOOL_EVENT_FLOW:
            return {
                ...state
            }
        case UNLOAD_SCHOOL_EVENT:
            state.eventInfo = {};
            state.dateStr = '';
            state.formStartTime = '';
            state.actionId = '';
            
            return {
                ...state
            }
        default:
            return state
    }
  }
  
  export default reducer