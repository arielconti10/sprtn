import {
    SUBSIDIARY_CREATING,
    SUBSIDIARY_CREATE_SUCCESS,
    SUBSIDIARY_CREATE_ERROR,
    SUBSIDIARY_UPDATING,
    SUBSIDIARY_UPDATE_SUCCESS,
    SUBSIDIARY_UPDATE_ERROR,
    SUBSIDIARY_LOADING,
    SUBSIDIARY_LOAD_SUCCESS,
    SUBSIDIARY_REQUESTING,
    SUBSIDIARY_REQUEST_SUCCESS,
    SUBSIDIARY_REQUEST_ERROR,
    SUBSIDIARY_CURRENT_CLEAR,
  } from '../actionTypes/subsidiary'
  
  export const subsidiaryCreate = function subsidiaryCreate (user, subsidiary) {
    return {
      type: SUBSIDIARY_CREATING,
      user,
      subsidiary,
    }
  }
  
  export const subsidiaryCreateSuccess = function subsidiaryCreateSuccess (subsidiary) {
    return {
      type: SUBSIDIARY_CREATE_SUCCESS,
      subsidiary,
    }
  }
  
  export const subsidiaryCreateError = function subsidiaryCreateError (error) {
    return {
      type: SUBSIDIARY_CREATE_ERROR,
      error,
    }
  }

  export const subsidiaryUpdate = function subsidiaryUpdate (user, subsidiary) {
    return {
      type: SUBSIDIARY_UPDATING,
      user,
      subsidiary,
    }
  }
  
  export const subsidiaryLoad = function subsidiaryLoad(user, subsidiary) {  
      return {
          type: SUBSIDIARY_LOADING,
          user,
          subsidiary,
      }
  }

  export const subsidiaryLoadSuccess = function subsidiaryLoadSuccess(subsidiary){
      return {
          type: SUBSIDIARY_LOAD_SUCCESS,
          subsidiary
      }
  }

  export const subsidiaryUpdateSuccess = function subsidiaryUpdateSuccess (subsidiary) {
    return {
      type: SUBSIDIARY_UPDATE_SUCCESS,
      subsidiary,
    }
  }
  
  export const subsidiaryUpdateError = function subsidiaryUpdateError (error) {
    return {
      type: SUBSIDIARY_UPDATE_ERROR,
      error,
    }
  }
  
  export const subsidiaryRequest = function subsidiaryRequest (client) {
    return {
      type: SUBSIDIARY_REQUESTING,
      client,
    }
  }
  
  export const subsidiaryRequestSuccess = function subsidiaryRequestSuccess (subsidiarys) {
    return {
      type: SUBSIDIARY_REQUEST_SUCCESS,
      subsidiarys,
    }
  }
  
  export const subsidiaryRequestError = function subsidiaryRequestError (error) {
    return {
      type: SUBSIDIARY_REQUEST_ERROR,
      error,
    }
  }

  export const subsidiaryCurrentClear = function subsidiaryCurrentClear(user) {
      return {
          type: SUBSIDIARY_CURRENT_CLEAR,
          user
      }
  }
  