import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects'
// import { handleApiErrors } from '../lib/api-errors'
import {
  LOCALIZATION_CREATING,
  LOCALIZATION_UPDATING,
  LOCALIZATION_REQUESTING,
  LOCALIZATION_LOADING 
} from '../actionTypes/localization'

import {
  localizationCreateSuccess,
  localizationCreateError,
  localizationRequestSuccess,
  localizationRequestError,
  localizationLoadSuccess,
  localizationUpdateSuccess,
} from '../actions/localization'

const apiUrl = `${process.env.API_URL}`

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

function localizationCreate(user, localization) {
  localization.active = true
  const url = `${apiUrl}/localization`
  const request = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.access_token || undefined,
    },
    body: JSON.stringify(localization),
  })

  return handleRequest(request)
}

function localizationUpdate(user, localization) {

  let data = {
    'name': localization.name,
    'active': localization.active
  }

  const url = `${apiUrl}/localization/${localization.id}`
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

function* localizationCreateFlow(action) {
  try {
    const {
      user,
      localization
    } = action

    if (localization.id !== undefined) {
      const updatedLocalization = yield call(localizationUpdate, user, localization)
      yield put(localizationUpdateSuccess(updatedLocalization))
    } else {
      const createdLocalization = yield call(localizationCreate, user, localization)
      yield put(localizationCreateSuccess(createdLocalization))

    }

    history.push('/cadastro/tipos-localizacao')

  } catch (error) {
    // same with error
    yield put(localizationCreateError(error))
  }
}

function localizationRequest(user) {
  const url = `${apiUrl}/localization`
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

function* localizationRequestFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      localization
    } = action

    if(localization.id !== undefined){
      const current_localization = yield call(localizationLoad, user, localization)
      yield put(localizationLoadSuccess(current_localization))      
    } else {
      const localizations = yield call(localizationRequest, user)
      yield put(localizationRequestSuccess(localization))
    }
    
  } catch (error) {
    yield put(localizationRequestError(error))
  }
}

function* localizationLoadFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      localization
    } = action
    
    const current_localization = yield call(localizationLoad, user, localization)
    yield put(localizationLoadSuccess(current_localization))
  } catch (error) {
    yield put(localizationRequestError(error))
  }
}

function localizationLoad(user, localization) {
  const request = fetch(`${apiUrl}/localization/${localization}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
    })
    return handleRequest(request)
}

function* localizationWatcher() {
  // each of the below RECEIVES the action from the .. action
  yield [
    takeLatest(LOCALIZATION_CREATING, localizationCreateFlow),
    takeLatest(LOCALIZATION_REQUESTING, localizationRequestFlow),
    takeLatest(LOCALIZATION_LOADING, localizationLoadFlow),
  ]
}

export default localizationWatcher