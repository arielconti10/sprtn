import {
    LOAD_SCHOOL_FLOW, SET_SCHOOL, UPDATE_LOADER
} from '../actionTypes/school';

export function loadSchoolFlow(user, school_id) {
    return {
        type: LOAD_SCHOOL_FLOW,
        user,
        school_id
    }
}

export function setSchool(school) {
    return {
        type: SET_SCHOOL,
        school
    }
}

export function updateLoader(ringLoad) {
    return {
        type: UPDATE_LOADER,
        ringLoad
    }
}