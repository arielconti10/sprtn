import {
    SET_MEETING_PROFILE_FLOW, SET_MEETING_PROFILE, SET_MEETING_UNIFIED_FLOW, SET_MEETING_UNIFIED,
    CHANGE_MEETING_DATE_FLOW, SET_MEETING_DATE, LOAD_MEETING_SHIFTS_FLOW, SET_MEETING_SHIFTS,
    CHANGE_MEETING_SHIFT_FLOW, SET_MEETING_SHIFT_ID, INSERT_SCHOOL_MEETING_FLOW,
    UNLOAD_SCHOOL_MEETING, SET_MEETING_SUBMITED
} from '../actionTypes/meeting'

export function setMeetingProfileFlow(profileId) {
    return {
        type: SET_MEETING_PROFILE_FLOW,
        profileId
    }
}

export function setMeetingProfile(profileId) {
    return {
        type: SET_MEETING_PROFILE,
        profileId
    }
}

export function setMeetingUnifiedFlow(unifiedId) {
    return {
        type: SET_MEETING_UNIFIED_FLOW,
        unifiedId
    }
}

export function setMeetingUnified(unifiedId) {
    return {
        type: SET_MEETING_UNIFIED,
        unifiedId
    }
}

export function changeMeetingDateFlow(meetingDate) {
    return {
        type: CHANGE_MEETING_DATE_FLOW,
        meetingDate
    }
}

export function setMeetingDate(meetingDate) {
    return {
        type: SET_MEETING_DATE,
        meetingDate
    }
}

export function loadMeetingShiftsFlow(user) {
    return {
        type: LOAD_MEETING_SHIFTS_FLOW,
        user
    }
}

export function setMeetingShifts(shifts) {
    return {
        type: SET_MEETING_SHIFTS,
        shifts
    }
}

export function changeMeetingShiftFlow(shiftId) {
    return {
        type: CHANGE_MEETING_SHIFT_FLOW,
        shiftId
    }
}

export function setMeetingShiftId(shiftId) {
    return {
        type: SET_MEETING_SHIFT_ID,
        shiftId
    }
}

export function insertSchoolMeetingFlow(user, meeting) {
    return {
        type: INSERT_SCHOOL_MEETING_FLOW,
        user,
        meeting
    }
}

export function unloadSchoolMeeting() {
    return {
        type: UNLOAD_SCHOOL_MEETING
    }
}

export function setMeetingSubmited() {
    return {
        type: SET_MEETING_SUBMITED
    }
}