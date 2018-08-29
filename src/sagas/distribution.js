import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
  } from '../actionTypes/distribution'
  
  import {
    setDistributionList
  } from '../actions/distribution'
  
  
  // We'll use this function to redirect to different routes based on cases
  import {
    createHashHistory
  } from 'history'
  
  export const history = createHashHistory()
  
  // Nice little helper to deal with the response
  // converting it to json, and handling errors
  function handleRequest(request) {
    return request
      .then(response => response.json())
      .then(json => json)
      .catch((error) => {
        throw error
      })
  }

  function* loadDistributionListFlow(action) {
      yield put(setDistributionList(action.data));
  }
  
  function* distributioneWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
        takeLatest("LOAD_DISTRIBUTION_LIST_FLOW", loadDistributionListFlow)
    ]
  }
  
  export default distributioneWatcher