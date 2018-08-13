import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects'
// import { handleApiErrors } from '../lib/api-errors'
import {
  SECTOR_CREATING,
  SECTOR_UPDATING,
  SECTOR_REQUESTING,
  SECTOR_LOADING 
} from '../actionTypes/sector'

import {
  sectorCreateSuccess,
  sectorCreateError,
  sectorRequestSuccess,
  sectorRequestError,
  sectorLoadSuccess,
  sectorUpdateSuccess,
} from '../actions/sector'

const apiUrl = `${process.env.API_URL}/sector`

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

function sectorCreate(user, sector) {
  sector.active = true
  const url = `${apiUrl}`
  const request = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.access_token || undefined,
    },
    body: JSON.stringify(sector),
  })

  return handleRequest(request)
}

function sectorUpdate(user, sector) {
  console.log(sector)  
  let data = {
    'name': sector.name,
    'active': sector.active,
    'code': sector.code,
  }

  const url = `${apiUrl}/${sector.id}`
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

function* sectorCreateFlow(action) {
  try {
    const {
      user,
      sector
    } = action
    console.log(sector)
    if (sector.id !== undefined) {
      const updatedsector = yield call(sectorUpdate, user, sector)
      yield put(sectorUpdateSuccess(updatedsector))
    } else {
      const createdsector = yield call(sectorCreate, user, sector)
      yield put(sectorCreateSuccess(createdsector))

    }

    history.push('/cadastro/setores')

  } catch (error) {
    // same with error
    yield put(sectorCreateError(error))
  }
}

function sectorRequest(user) {
  const url = `${apiUrl}`
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

function* sectorRequestFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      sector
    } = action

    if(sector.id !== undefined){
      const current_sector = yield call(sectorLoad, user, sector)
      yield put(sectorLoadSuccess(current_sector))      
    } else {
      const sectors = yield call(sectorRequest, user)
      yield put(sectorRequestSuccess(sector))
    }
    
  } catch (error) {
    yield put(sectorRequestError(error))
  }
}

function* sectorLoadFlow(action) {
  try {
    // grab the user from our action
    const {
      user,
      sector
    } = action
    
    const current_sector = yield call(sectorLoad, user, sector)
    yield put(sectorLoadSuccess(current_sector))
  } catch (error) {
    yield put(sectorRequestError(error))
  }
}

function sectorLoad(user, sector) {
  const request = fetch(`${apiUrl}/${sector}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
    })
    return handleRequest(request)
}

function* sectorWatcher() {
  // each of the below RECEIVES the action from the .. action
  yield [
    takeLatest(SECTOR_CREATING, sectorCreateFlow),
    takeLatest(SECTOR_UPDATING, sectorCreateFlow),
    takeLatest(SECTOR_REQUESTING, sectorRequestFlow),
    takeLatest(SECTOR_LOADING, sectorLoadFlow),
  ]
}

export default sectorWatcher