import {
    SCHOOL_TYPES_CREATING,
    SCHOOL_TYPES_CREATE_SUCCESS,
    SCHOOL_TYPES_CREATE_ERROR,
    SCHOOL_TYPES_UPDATING,
    SCHOOL_TYPES_UPDATE_SUCCESS,
    SCHOOL_TYPES_UPDATE_ERROR,
    SCHOOL_TYPES_LOADING,
    SCHOOL_TYPES_LOAD_SUCCESS,
    SCHOOL_TYPES_REQUESTING,
    SCHOOL_TYPES_REQUEST_SUCCESS,
    SCHOOL_TYPES_REQUEST_ERROR,
  } from '../actionTypes/schoolTypes'
  
  export const schoolTypeCreate = function schoolTypeCreate (user, schoolType) {
    return {
      type: SCHOOL_TYPES_CREATING,
      user,
      schoolType,
    }
  }
  
  export const schoolTypeCreateSuccess = function schoolTypeCreateSuccess (schoolType) {
    return {
      type: SCHOOL_TYPES_CREATE_SUCCESS,
      schoolType,
    }
  }
  
  export const schoolTypeCreateError = function schoolTypeCreateError (error) {
    return {
      type: SCHOOL_TYPES_CREATE_ERROR,
      error,
    }
  }

  export const schoolTypeUpdate = function schoolTypeUpdate (user, schoolType) {
    return {
      type: SCHOOL_TYPES_UPDATING,
      user,
      schoolType,
    }
  }
  
  export const schoolTypeLoad = function schoolTypeLoad(user, schoolType) {      
      return {
          type: SCHOOL_TYPES_LOADING,
          user,
          schoolType,
      }
  }

  export const schoolTypeLoadSuccess = function schoolTypeLoadSuccess(schoolType){
      return {
          type: SCHOOL_TYPES_LOAD_SUCCESS,
          schoolType
      }
  }

  export const schoolTypeUpdateSuccess = function schoolTypeUpdateSuccess (schoolType) {
    return {
      type: SCHOOL_TYPES_UPDATE_SUCCESS,
      schoolType,
    }
  }
  
  export const schoolTypeUpdateError = function schoolTypeUpdateError (error) {
    return {
      type: SCHOOL_TYPES_UPDATE_ERROR,
      error,
    }
  }
  
  export const schoolTypeRequest = function schoolTypeRequest (user) {
    return {
      type: SCHOOL_TYPES_REQUESTING,
      user,
    }
  }
  
  export const schoolTypeRequestSuccess = function schoolTypeRequestSuccess (schoolTypes) {
    return {
      type: SCHOOL_TYPES_REQUEST_SUCCESS,
      schoolTypes,
    }
  }
  
  export const schoolTypeRequestError = function schoolTypeRequestError (error) {
    return {
      type: SCHOOL_TYPES_REQUEST_ERROR,
      error,
    }
  }
  