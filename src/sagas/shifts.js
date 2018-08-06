import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects'
// import { handleApiErrors } from '../lib/api-errors'
import {
  SHIFT_CREATING,
  SHIFT_UPDATING,
  SHIFT_REQUESTING,
  SHIFT_LOADING 
} from '../actionTypes/shifts'

import {
  shiftCreateSuccess,
  shiftCreateError,
  shiftRequestSuccess,
  shiftRequestError,
  shiftLoadSuccess,
  shiftUpdateSuccess,
} from '../actions/shifts'

const shiftsUrl = `${process.env.API_URL}`

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

function shiftCreate(user, shift) {
  shift.active = true
  const url = `${shiftsUrl}/shift`
  const request = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
      // passes our token as an "Authorization" header in
      // every POST request.
      Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
    },
    body: JSON.stringify(shift),
  })

  return handleRequest(request)
}

function shiftUpdate(user, shift) {

  console.log(shift);

  // const url = `${shiftsUrl}/shift/${shift.id}`
  // const request = fetch(url, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json', 
  //     Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
  //   },
  //   body: JSON.stringify(shift),
  // })

  return handleRequest(request)
}

function* shiftCreateFlow(action) {
  try {
    const {
      user,
      shift
    } = action

    if (shift.id !== undefined) {
      const updatedShift = yield call(shiftUpdate, user, shift)
      yield put(shiftUpdateSuccess(updated))

    } else {
      const createdshift = yield call(shiftCreate, user, shift)
      yield put(shiftCreateSuccess(createdshift))
    }


    history.push('/cadastro/turnos')

  } catch (error) {
    // same with error
    yield put(shiftCreateError(error))
  }
}

function shiftsRequest(user) {
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

function* shiftRequestFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      shift
    } = action

    if(shift.id !== undefined){
      const current_shift = yield call(shiftLoad, user, shift)
      yield put(shiftLoadSuccess(current_shift))      
    } else {
      // call to our shiftRequestApi function with the user
      const shifts = yield call(shiftsRequest, user)
      yield put(shiftRequestSuccess(shifts))
    }
    
    // dispatch the action with our shifts!
  } catch (error) {
    yield put(shiftRequestError(error))
  }
}

function* shiftLoadFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      shift
    } = action
    
    const current_shift = yield call(shiftLoad, user, shift)
    yield put(shiftLoadSuccess(current_shift))

    // dispatch the action with our shifts!
  } catch (error) {
    yield put(shiftRequestError(error))
  }
}

function shiftLoad(user, shift) {
  const request = fetch(`${shiftsUrl}/shift/${shift}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
    })
    return handleRequest(request)
}

function* shiftsWatcher() {
  // each of the below RECEIVES the action from the .. action
  yield [
    takeLatest(SHIFT_CREATING, shiftCreateFlow),
    takeLatest(SHIFT_REQUESTING, shiftRequestFlow),
    takeLatest(SHIFT_LOADING, shiftLoadFlow),
  ]
}

export default shiftsWatcher