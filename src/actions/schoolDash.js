import {
    LOAD_DASH_FLOW, SET_YEARS, CHANGE_YEAR_FLOW, SET_YEAR_PARAM, SET_PUBLISHERS,
    UPDATE_LOADER, SET_COLECTIONS
} from '../actionTypes/schoolDash';

export function loadDashFlow(user, marketshare) {
    return {
        type: LOAD_DASH_FLOW,
        user,
        marketshare
    }
}

export function setYears(years) {
    return {
        type: SET_YEARS,
        years
    }
}

export function changeYearFlow(year_param, marketshare) {
    return {
        type: CHANGE_YEAR_FLOW,
        year_param,
        marketshare
    }
}

export function setYearParam(year_param) {
    return {
        type: SET_YEAR_PARAM,
        year_param
    }
}

export function setPublishers(publishers) {
    return {
        type: SET_PUBLISHERS,
        publishers
    }
}

export function updateLoader(ringLoad) {
    return {
        type: UPDATE_LOADER,
        ringLoad
    }
}

export function setColections(colections) {
    return {
        type: SET_COLECTIONS,
        colections
    }
}