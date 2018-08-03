import { call, put, takeLatest } from 'redux-saga/effects'

// import { handleApiErrors } from '../lib/api-errors'

import {
  // INDICATORS_CREATING, 
  INDICATORS_REQUESTING,
  WIDGET_REQUESTING,
} from '../actionTypes/indicators'

import {
  indicatorsRequestSuccess,
  indicatorsRequestError,
} from '../actions/indicators'

const apiUrl = `${process.env.API_URL}`

const schools = [
    { "value": "PARTICULAR", "label": "Particular" },
    { "value": "PUBLICO", "label": "Público" },
    { "value": "SECRETARIA", "label": "Secretaria" }
]

// Nice little helper to deal with the response
// converting it to json, and handling errors
function handleRequest (request) {
  return request
    // .then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

function contributorsRequestApi (client) {
  const url = `${apiUrl}/hierarchy/childrens`
  const request = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // passe our token as an "Authorization" header
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    },
  })

  return handleRequest(request)
}

function* indicatorsRequestFlow (action) {
  try {
    // grab the client from our action
    // const { client } = action

    // call to our widgetRequestApi function with the client
    const contributors = yield call(contributorsRequestApi)
    
    // dispatch the action with our widgets!
    yield put(indicatorsRequestSuccess(contributors, schools))
  } catch (error) {
    yield put(indicatorsRequestError(error))
  }
}

function* indicatorsWatcher () {
  // each of the below RECEIVES the action from the .. action
  yield [
    // takeLatest(WIDGET_CREATING, widgetCreateFlow),
    takeLatest(INDICATORS_REQUESTING, indicatorsRequestFlow),
  ]
}

export default indicatorsWatcher
