import {
    DISCIPLINE_CREATING,
    DISCIPLINE_CREATE_SUCCESS,
    DISCIPLINE_CREATE_ERROR,
    DISCIPLINE_UPDATING,
    DISCIPLINE_UPDATE_SUCCESS,
    DISCIPLINE_UPDATE_ERROR,
    DISCIPLINE_LOADING,
    DISCIPLINE_LOAD_SUCCESS,
    DISCIPLINE_REQUESTING,
    DISCIPLINE_REQUEST_SUCCESS,
    DISCIPLINE_REQUEST_ERROR,
    DISCIPLINE_CURRENT_CLEAR,
  } from '../actionTypes/discipline'
  
  export const disciplineCreate = function disciplineCreate (user, discipline) {
    return {
      type: DISCIPLINE_CREATING,
      user,
      discipline,
    }
  }
  
  export const disciplineCreateSuccess = function disciplineCreateSuccess (discipline) {
    return {
      type: DISCIPLINE_CREATE_SUCCESS,
      discipline,
    }
  }
  
  export const disciplineCreateError = function disciplineCreateError (error) {
    return {
      type: DISCIPLINE_CREATE_ERROR,
      error,
    }
  }

  export const disciplineUpdate = function disciplineUpdate (user, discipline) {
    return {
      type: DISCIPLINE_UPDATING,
      user,
      discipline,
    }
  }
  
  export const disciplineLoad = function disciplineLoad(user, discipline) {  
      return {
          type: DISCIPLINE_LOADING,
          user,
          discipline,
      }
  }

  export const disciplineLoadSuccess = function disciplineLoadSuccess(discipline){
      return {
          type: DISCIPLINE_LOAD_SUCCESS,
          discipline
      }
  }

  export const disciplineUpdateSuccess = function disciplineUpdateSuccess (discipline) {
    return {
      type: DISCIPLINE_UPDATE_SUCCESS,
      discipline,
    }
  }
  
  export const disciplineUpdateError = function disciplineUpdateError (error) {
    return {
      type: DISCIPLINE_UPDATE_ERROR,
      error,
    }
  }
  
  export const disciplineRequest = function disciplineRequest (user) {
    console.log(user)  
    return {
      type: DISCIPLINE_REQUESTING,
      user,
    }
  }
  
  export const disciplineRequestSuccess = function disciplineRequestSuccess (disciplines) {
    console.log(disciplines)  
    return {
      type: DISCIPLINE_REQUEST_SUCCESS,
      disciplines,
    }
  }
  
  export const disciplineRequestError = function disciplineRequestError (error) {
    return {
      type: DISCIPLINE_REQUEST_ERROR,
      error,
    }
  }

  export const disciplineCurrentClear = function disciplineCurrentClear(user) {
      return {
          type: DISCIPLINE_CURRENT_CLEAR,
          user
      }
  }
  