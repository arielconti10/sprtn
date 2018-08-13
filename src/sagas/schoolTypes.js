import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects'
// import { handleApiErrors } from '../lib/api-errors'
import {
  SCHOOL_TYPES_CREATING,
  SCHOOL_TYPES_UPDATING,
  SCHOOL_TYPES_REQUESTING,
  SCHOOL_TYPES_LOADING 
} from '../actionTypes/schoolTypes'

import {
  schoolTypeCreateSuccess,
  schoolTypeCreateError,
  schoolTypeRequestSuccess,
  schoolTypeRequestError,
  schoolTypeLoadSuccess,
  schoolTypeUpdateSuccess,
} from '../actions/schoolTypes'

const schoolTypesUrl = `${process.env.API_URL}`

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

function schoolTypeCreate(user, schoolType) {
  schoolType.active = true
  const url = `${schoolTypesUrl}/school-type`
  const request = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
      // passes our token as an "Authorization" header in
      // every POST request.
      Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
    },
    body: JSON.stringify(schoolType),
  })

  return handleRequest(request)
}

function schoolTypeUpdate(user, schoolType) {

  let data = {
    'name': schoolType.name,
    'active': schoolType.active
  }

  const url = `${schoolTypesUrl}/school-type/${schoolType.id}`
  const request = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json', 
      Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
    },
    body: JSON.stringify(data),
  })

  return handleRequest(request)
}

function* schoolTypeCreateFlow(action) {
  try {
    const {
      user,
      schoolType
    } = action

    if (schoolType.id !== undefined) {
      const updatedschoolType = yield call(schoolTypeUpdate, user, schoolType)
      yield put(schoolTypeUpdateSuccess(updatedschoolType))
    } else {
      const createdschoolType = yield call(schoolTypeCreate, user, schoolType)
      yield put(schoolTypeCreateSuccess(createdschoolType))

    }

    history.push('/cadastro/tipos-escola')

  } catch (error) {
    // same with error
    yield put(schoolTypeCreateError(error))
  }
}

function schoolTypesRequest(user) {
  const url = `${schoolTypesUrl}/school-type`
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

function* schoolTypeRequestFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      schoolType
    } = action

    if(schoolType.id !== undefined){
      const current_schoolType = yield call(schoolTypeLoad, user, schoolType)
      yield put(schoolTypeLoadSuccess(current_schoolType))      
    } else {
      // call to our schoolTypeRequestApi function with the user
      const schoolTypes = yield call(schoolTypesRequest, user)
      yield put(schoolTypeRequestSuccess(schoolTypes))
    }
    
    // dispatch the action with our schoolTypes!
  } catch (error) {
    yield put(schoolTypeRequestError(error))
  }
}

function* schoolTypeLoadFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      schoolType
    } = action
    
    console.log(schoolType)

    const current_schoolType = yield call(schoolTypeLoad, user, schoolType)
    yield put(schoolTypeLoadSuccess(current_schoolType))

    // dispatch the action with our schoolTypes!
  } catch (error) {
    yield put(schoolTypeRequestError(error))
  }
}

function schoolTypeLoad(user, schoolType) {
  const request = fetch(`${schoolTypesUrl}/school-type/${schoolType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
    })
    return handleRequest(request)
}

function* schoolTypesWatcher() {
  // each of the below RECEIVES the action from the .. action
  yield [
    takeLatest(SCHOOL_TYPES_CREATING, schoolTypeCreateFlow),
    takeLatest(SCHOOL_TYPES_REQUESTING, schoolTypeRequestFlow),
    takeLatest(SCHOOL_TYPES_LOADING, schoolTypeLoadFlow),
  ]
}

export default schoolTypesWatcher