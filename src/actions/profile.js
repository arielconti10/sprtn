import {
    PROFILE_CREATING,
    PROFILE_CREATE_SUCCESS,
    PROFILE_CREATE_ERROR,
    PROFILE_UPDATING,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_ERROR,
    PROFILE_LOADING,
    PROFILE_LOAD_SUCCESS,
    PROFILE_REQUESTING,
    PROFILE_REQUEST_SUCCESS,
    PROFILE_REQUEST_ERROR,
    PROFILE_CURRENT_CLEAR,
  } from '../actionTypes/profile'
  
  export const profileCreate = function profileCreate (user, profile) {
    return {
      type: PROFILE_CREATING,
      user,
      profile,
    }
  }
  
  export const profileCreateSuccess = function profileCreateSuccess (profile) {
    return {
      type: PROFILE_CREATE_SUCCESS,
      profile,
    }
  }
  
  export const profileCreateError = function profileCreateError (error) {
    return {
      type: PROFILE_CREATE_ERROR,
      error,
    }
  }

  export const profileUpdate = function profileUpdate (user, profile) {
    return {
      type: PROFILE_UPDATING,
      user,
      profile,
    }
  }
  
  export const profileLoad = function profileLoad(user, profile) {  
      return {
          type: PROFILE_LOADING,
          user,
          profile,
      }
  }

  export const profileLoadSuccess = function profileLoadSuccess(profile){
      return {
          type: PROFILE_LOAD_SUCCESS,
          profile
      }
  }

  export const profileUpdateSuccess = function profileUpdateSuccess (profile) {
    return {
      type: PROFILE_UPDATE_SUCCESS,
      profile,
    }
  }
  
  export const profileUpdateError = function profileUpdateError (error) {
    return {
      type: PROFILE_UPDATE_ERROR,
      error,
    }
  }
  
  export const profileRequest = function profileRequest (client) {
    return {
      type: PROFILE_REQUESTING,
      client,
    }
  }
  
  export const profileRequestSuccess = function profileRequestSuccess (profiles) {
    return {
      type: PROFILE_REQUEST_SUCCESS,
      profiles,
    }
  }
  
  export const profileRequestError = function profileRequestError (error) {
    return {
      type: PROFILE_REQUEST_ERROR,
      error,
    }
  }

  export const profileCurrentClear = function profileCurrentClear(user) {
      return {
          type: PROFILE_CURRENT_CLEAR,
          user
      }
  }
  