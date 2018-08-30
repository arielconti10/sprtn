import {
    JOB_TITLE_CREATING,
    JOB_TITLE_CREATE_SUCCESS,
    JOB_TITLE_CREATE_ERROR,
    JOB_TITLE_UPDATING,
    JOB_TITLE_UPDATE_SUCCESS,
    JOB_TITLE_UPDATE_ERROR,
    JOB_TITLE_LOADING,
    JOB_TITLE_LOAD_SUCCESS,
    JOB_TITLE_REQUESTING,
    JOB_TITLE_REQUEST_SUCCESS,
    JOB_TITLE_REQUEST_ERROR,
    JOB_TITLE_CURRENT_CLEAR,
    UNLOAD_JOB_TITLE
  } from '../actionTypes/job_title'
  
  export const job_titleCreate = function job_titleCreate (user, job_title) {
    return {
      type: JOB_TITLE_CREATING,
      user,
      job_title,
    }
  }
  
  export const job_titleCreateSuccess = function job_titleCreateSuccess (job_title) {
    return {
      type: JOB_TITLE_CREATE_SUCCESS,
      job_title,
    }
  }
  
  export const job_titleCreateError = function job_titleCreateError (error) {
    return {
      type: JOB_TITLE_CREATE_ERROR,
      error,
    }
  }

  export const job_titleUpdate = function job_titleUpdate (user, job_title) {
    return {
      type: JOB_TITLE_UPDATING,
      user,
      job_title,
    }
  }
  
  export const job_titleLoad = function job_titleLoad(user, job_title) {  
      return {
          type: JOB_TITLE_LOADING,
          user,
          job_title,
      }
  }

  export const job_titleLoadSuccess = function job_titleLoadSuccess(job_title){
      return {
          type: JOB_TITLE_LOAD_SUCCESS,
          job_title
      }
  }

  export const job_titleUpdateSuccess = function job_titleUpdateSuccess (job_title) {
    return {
      type: JOB_TITLE_UPDATE_SUCCESS,
      job_title,
    }
  }
  
  export const job_titleUpdateError = function job_titleUpdateError (error) {
    return {
      type: JOB_TITLE_UPDATE_ERROR,
      error,
    }
  }
  
  export const job_titleRequest = function job_titleRequest (client) {
    return {
      type: JOB_TITLE_REQUESTING,
      client,
    }
  }
  
  export const job_titleRequestSuccess = function job_titleRequestSuccess (job_titles) {
    return {
      type: JOB_TITLE_REQUEST_SUCCESS,
      job_titles,
    }
  }
  
  export const job_titleRequestError = function job_titleRequestError (error) {
    return {
      type: JOB_TITLE_REQUEST_ERROR,
      error,
    }
  }

  export const job_titleCurrentClear = function job_titleCurrentClear(user) {
      return {
          type: JOB_TITLE_CURRENT_CLEAR,
          user
      }
  }

  export function unloadJobTitle() {
      return {
          type: UNLOAD_JOB_TITLE
      }
  }
  