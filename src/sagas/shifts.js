import { call, put, takeLatest } from 'redux-saga/effects'
// import { handleApiErrors } from '../lib/api-errors'
import {
  SHIFT_CREATING,
  SHIFT_REQUESTING,
} from '../actionTypes/shifts'

import {
  shiftCreateSuccess,
  shiftCreateError,
  shiftRequestSuccess,
  shiftRequestError,
} from '../actions/shifts'

const shiftsUrl = `${process.env.API_URL}`

// We'll use this function to redirect to different routes based on cases
import { createHashHistory } from 'history'

export const history = createHashHistory()

// Nice little helper to deal with the response
// converting it to json, and handling errors
function handleRequest (request) {
  return request
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

function shiftCreate (user, shift) {
  shift.active = true  
  const url = `${shiftsUrl}/shift`
  const request = fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:9001',
      // passes our token as an "Authorization" header in
      // every POST request.
      Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
    },
    body: JSON.stringify(shift),
  })

  return handleRequest(request)
}

function* shiftCreateFlow (action) {
  try {
    const { user, shift } = action

    const createdshift = yield call(shiftCreate, user, shift)
    // creates the action with the format of
    // {
    //   type: SHIFT_CREATE_SUCCESS,
    //   shift,
    // }
    // Which we could do inline here, but again, consistency
    yield put(shiftCreateSuccess(createdshift))

    history.push('/cadastro/turnos')

} catch (error) {
    // same with error
    yield put(shiftCreateError(error))
  }
}

function shiftRequest (user) {
  const url = `${shiftsUrl}/shifts`
  const request = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // passe our token as an "Authorization" header
      Authorization: 'Bearer ' + user.access_token || undefined,
    },
  })

  return handleRequest(request)
}

function* shiftRequestFlow (action) {
  try {
    // grab the user from our action
    const { user } = action
    // call to our shiftRequestApi function with the user
    const shifts = yield call(shiftRequestApi, user)
    // dispatch the action with our shifts!
    yield put(shiftRequestSuccess(shifts))
  } catch (error) {
    yield put(shiftRequestError(error))
  }
}

function* shiftsWatcher () {
  // each of the below RECEIVES the action from the .. action
  yield [
    takeLatest(SHIFT_CREATING, shiftCreateFlow),
    takeLatest(SHIFT_REQUESTING, shiftRequestFlow),
  ]
}

export default shiftsWatcher
