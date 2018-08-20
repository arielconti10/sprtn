import {
    CONGREGATION_CREATING,
    CONGREGATION_CREATE_SUCCESS,
    CONGREGATION_CREATE_ERROR,
    CONGREGATION_UPDATING,
    CONGREGATION_UPDATE_SUCCESS,
    CONGREGATION_UPDATE_ERROR,
    CONGREGATION_LOADING,
    CONGREGATION_LOAD_SUCCESS,
    CONGREGATION_REQUESTING,
    CONGREGATION_REQUEST_SUCCESS,
    CONGREGATION_REQUEST_ERROR,
    CONGREGATION_CURRENT_CLEAR,
  } from '../actionTypes/congregation'
  
  export const congregationCreate = function congregationCreate (user, congregation) {
    return {
      type: CONGREGATION_CREATING,
      user,
      congregation,
    }
  }
  
  export const congregationCreateSuccess = function congregationCreateSuccess (congregation) {
    return {
      type: CONGREGATION_CREATE_SUCCESS,
      congregation,
    }
  }
  
  export const congregationCreateError = function congregationCreateError (error) {
    return {
      type: CONGREGATION_CREATE_ERROR,
      error,
    }
  }

  export const congregationUpdate = function congregationUpdate (user, congregation) {
    return {
      type: CONGREGATION_UPDATING,
      user,
      congregation,
    }
  }
  
  export const congregationLoad = function congregationLoad(user, congregation) {  
      return {
          type: CONGREGATION_LOADING,
          user,
          congregation,
      }
  }

  export const congregationLoadSuccess = function congregationLoadSuccess(congregation){
      return {
          type: CONGREGATION_LOAD_SUCCESS,
          congregation
      }
  }

  export const congregationUpdateSuccess = function congregationUpdateSuccess (congregation) {
    return {
      type: CONGREGATION_UPDATE_SUCCESS,
      congregation,
    }
  }
  
  export const congregationUpdateError = function congregationUpdateError (error) {
    return {
      type: CONGREGATION_UPDATE_ERROR,
      error,
    }
  }
  
  export const congregationRequest = function congregationRequest (client) {
    return {
      type: CONGREGATION_REQUESTING,
      client,
    }
  }
  
  export const congregationRequestSuccess = function congregationRequestSuccess (congregations) {
    return {
      type: CONGREGATION_REQUEST_SUCCESS,
      congregations,
    }
  }
  
  export const congregationRequestError = function congregationRequestError (error) {
    return {
      type: CONGREGATION_REQUEST_ERROR,
      error,
    }
  }

  export const congregationCurrentClear = function congregationCurrentClear(user) {
      return {
          type: CONGREGATION_CURRENT_CLEAR,
          user
      }
  }
  