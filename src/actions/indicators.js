
import {
  INDICATORS_REQUESTING,
  INDICATORS_REQUEST_SUCCESS,
  INDICATORS_REQUEST_ERROR,
  CHANGE_HIERARCHY_REQUESTING,
  CHANGE_HIERARCHY_SUCCESS,
  UPDATE_RING_LOAD,
} from '../actionTypes/indicators'


export const indicatorsRequest = function indicatorsRequest (user) {
  return {
    type: INDICATORS_REQUESTING,
    user,
  }
}

export const indicatorsRequestSuccess = function indicatorsRequestSuccess (
    dataActions,
    actions,
    actionTypes,
    indicators, 
    schools, 
    schoolTypes, 
    studentTypes,
    contacts,
    coverage,
    total_action,
    total_schools,
    total_students,
    dataSchoolTypes,
    dataCoverage,
    dataActionTypes,
){
  return {
    type: INDICATORS_REQUEST_SUCCESS,
    dataActions,    
    actions,
    actionTypes,
    indicators,
    schools, 
    schoolTypes,
    studentTypes,
    contacts,
    coverage,
    total_action,
    total_schools,
    total_students,
    dataSchoolTypes,
    dataCoverage,
    dataActionTypes,
  }
}

export const indicatorsRequestError = function indicatorsRequestError (error) {

  return {
    type: INDICATORS_REQUEST_ERROR,
    error,
  }
}

export const changeHierarchyRequest = function changeHierarchyRequest ( hierarchy ) {
    return {
        type: CHANGE_HIERARCHY_REQUESTING,
        hierarchy
    }
}

export const changeHierarchySuccess = function changeHierarchySuccess ( actions, actionTypes, contacts, studentTypes, schoolTypes, total_schools, total_students, total_action, dataSchoolTypes, dataActions, dataActionTypes) {
    return {
        type: CHANGE_HIERARCHY_SUCCESS,
        actions,
        actionTypes,        
        contacts,
        studentTypes,
        schoolTypes,
        total_schools,
        total_students,
        total_action, 
        dataSchoolTypes, 
        // dataCoverage, 
        dataActions,
        dataActionTypes,
    }
}

export function updateRingLoad(ring_load) {
    return {
        type: UPDATE_RING_LOAD,
        ring_load
    }
}