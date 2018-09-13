import {
    LOAD_DISTRIBUTION_LIST_FLOW, SET_DISTRIBUTION_LIST
} from '../actionTypes/distribution'

export function loadDistributionListFlow(data) {
    return {
        type: LOAD_DISTRIBUTION_LIST_FLOW,
        data
    }
}

export function setDistributionList(distributionList) {
    return {
        type: SET_DISTRIBUTION_LIST,
        distributionList
    }
}