import {
    LEVEL_CREATING,
    LEVEL_CREATE_SUCCESS,
    LEVEL_CREATE_ERROR,
    LEVEL_UPDATING,
    LEVEL_UPDATE_SUCCESS,
    LEVEL_UPDATE_ERROR,
    LEVEL_LOADING,
    LEVEL_LOAD_SUCCESS,
    LEVEL_REQUESTING,
    LEVEL_REQUEST_SUCCESS,
    LEVEL_REQUEST_ERROR,
    LEVEL_CURRENT_CLEAR,
  } from '../actionTypes/level'
  
  export const levelCreate = function levelCreate (user, level) {
    return {
      type: LEVEL_CREATING,
      user,
      level,
    }
  }
  
  export const levelCreateSuccess = function levelCreateSuccess (level) {
    return {
      type: LEVEL_CREATE_SUCCESS,
      level,
    }
  }
  
  export const levelCreateError = function levelCreateError (error) {
    return {
      type: LEVEL_CREATE_ERROR,
      error,
    }
  }

  export const levelUpdate = function levelUpdate (user, level) {
    return {
      type: LEVEL_UPDATING,
      user,
      level,
    }
  }
  
  export const levelLoad = function levelLoad(user, level) {  
      return {
          type: LEVEL_LOADING,
          user,
          level,
      }
  }

  export const levelLoadSuccess = function levelLoadSuccess(level){
      return {
          type: LEVEL_LOAD_SUCCESS,
          level
      }
  }

  export const levelUpdateSuccess = function levelUpdateSuccess (level) {
    return {
      type: LEVEL_UPDATE_SUCCESS,
      level,
    }
  }
  
  export const levelUpdateError = function levelUpdateError (error) {
    return {
      type: LEVEL_UPDATE_ERROR,
      error,
    }
  }
  
  export const levelRequest = function levelRequest (user) {
    return {
      type: LEVEL_REQUESTING,
      user,
    }
  }
  
  export const levelRequestSuccess = function levelRequestSuccess (levels) {
    return {
      type: LEVEL_REQUEST_SUCCESS,
      levels,
    }
  }
  
  export const levelRequestError = function levelRequestError (error) {
    return {
      type: LEVEL_REQUEST_ERROR,
      error,
    }
  }

  export const levelCurrentClear = function levelCurrentClear(user) {
      return {
          type: LEVEL_CURRENT_CLEAR,
          user
      }
  }

  
  