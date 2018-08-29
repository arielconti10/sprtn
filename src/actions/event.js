import {
    ADD_EVENT_FLOW, SET_EVENT_COLLAPSE, CHANGE_EVENT_DATE_FLOW, SET_EVENT_DATE, OPEN_START_TIME_FLOW,
    SET_START_TIME, CHANGE_TIME_FLOW, SET_TIME, GET_EVENT_ACTIONS_FLOW, SET_EVENT_ACTIONS,
    CHANGE_EVENT_ACTION_FLOW, SET_EVENT_ACTION, LOAD_EVENTS_FLOW, SET_SCHOOL_EVENTS,
    DELETE_SCHOOL_EVENT_FLOW, ACTIVE_SCHOOL_EVENT_FLOW, FIND_SCHOOL_EVENT_FLOW,
    SET_SCHOOL_EVENT_INFO, UPDATE_SCHOOL_EVENT_FLOW, INSERT_SCHOOL_EVENT_FLOW,
    UNLOAD_SCHOOL_EVENT
} from '../actionTypes/event'

export function addEventFlow(collapse) {
    return {
        type: ADD_EVENT_FLOW,
        collapse
    }
}

export function setEventCollapse(collapse) {
    return {
        type: SET_EVENT_COLLAPSE,
        collapse
    }
}

export function changeEventDateFlow(dateStr) {
    return {
        type: CHANGE_EVENT_DATE_FLOW,
        dateStr
    }
}

export function setEventDate(dateStr) {
    return {
        type: SET_EVENT_DATE,
        dateStr
    }
}

export function openStartTimeFlow(formStartTime) {
    return {
        type: OPEN_START_TIME_FLOW,
        formStartTime
    }
}

export function setStartTime(formStartTime) {
    return {
        type: SET_START_TIME,
        formStartTime
    }
}

export function changeTimeFlow(formStartTime) {
    return {
        type: CHANGE_TIME_FLOW,
        formStartTime
    }
}

export function setTime(formStartTime) {
    return {
        type: SET_TIME,
        formStartTime
    }
}

export function getEventActionsFlow(user, identify) {
    return {
        type: GET_EVENT_ACTIONS_FLOW,
        user,
        identify
    }
}

export function setEventActions(actions) {
    return {
        type: SET_EVENT_ACTIONS,
        actions
    }
}

export function changeEventActionFlow(actionId) {
    return {
        type: CHANGE_EVENT_ACTION_FLOW,
        actionId
    }
}

export function setEventAction(actionId) {
    return {
        type: SET_EVENT_ACTION,
        actionId
    }
}

export function loadEventsFlow(user, schoolEvents) {
    return {
        type: LOAD_EVENTS_FLOW,
        user,
        schoolEvents
    }
}

export function setSchoolEvents(schoolEvents) {
    return {
        type: SET_SCHOOL_EVENTS,
        schoolEvents
    }
}

export function deleteSchoolEventFlow(user, eventId, schoolId) {
    return {
        type: DELETE_SCHOOL_EVENT_FLOW,
        user,
        eventId,
        schoolId
    }
}

export function activeSchoolEventFlow(user, eventInfo, eventId, schoolId) {
    return {
        type: ACTIVE_SCHOOL_EVENT_FLOW,
        user, 
        eventInfo, 
        eventId, 
        schoolId
    }
}

export function findSchoolEventFlow(eventInfo) {
    return {
        type: FIND_SCHOOL_EVENT_FLOW,
        eventInfo
    }
}

export function setSchoolEventInfo(eventInfo) {
    return {
        type: SET_SCHOOL_EVENT_INFO,
        eventInfo
    }
}

export function updateSchoolEventFlow(user, eventObject, eventId, schoolId) {
    return {
        type: UPDATE_SCHOOL_EVENT_FLOW,
        user,
        eventObject, 
        eventId, 
        schoolId
    }
}

export function insertSchoolEventFlow(user, eventObject, schoolId) {
    return {
        type: INSERT_SCHOOL_EVENT_FLOW,
        user,
        eventObject,
        schoolId
    }
}

export function unloadSchoolEvent() {
    return {
        type: UNLOAD_SCHOOL_EVENT
    }
}