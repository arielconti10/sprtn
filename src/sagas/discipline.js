import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    DISCIPLINE_CREATING,
    DISCIPLINE_UPDATING,
    DISCIPLINE_REQUESTING,
    DISCIPLINE_LOADING 
  } from '../actionTypes/discipline'
  
  import {
    disciplineCreateSuccess,
    disciplineCreateError,
    disciplineRequestSuccess,
    disciplineRequestError,
    disciplineLoadSuccess,
    disciplineUpdateSuccess,
  } from '../actions/discipline'
  
  const apiUrl = `${process.env.API_URL}/discipline`
  
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
  
  function disciplineCreate(user, discipline) {
    discipline.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(discipline),
    })
  
    return handleRequest(request)
  }
  
  function disciplineUpdate(user, discipline, active) {
      
    let data = {
      'name': discipline.name,
      'active': discipline.active,
      'code': discipline.code,
    }

    const url = `${apiUrl}/${discipline.id}`
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
  
  function* disciplineCreateFlow(action) {
    try {
      const {
        user,
        discipline,
      } = action
      if (discipline.id !== undefined) {
        const updateddiscipline = yield call(disciplineUpdate, user, discipline)
        yield put(disciplineUpdateSuccess(updateddiscipline))
      } else {
        const createddiscipline = yield call(disciplineCreate, user, discipline)
        yield put(disciplineCreateSuccess(createddiscipline))
  
      }
  
      history.push('/cadastro/disciplinas')
  
    } catch (error) {
      // same with error
      yield put(disciplineCreateError(error))
    }
  }
  
  function disciplineRequest(user) {
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
  
  function* disciplineRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        discipline
      } = action
  
      if(discipline.id !== undefined){
        const current_discipline = yield call(disciplineLoad, user, discipline)
        yield put(disciplineLoadSuccess(current_discipline))      
      } else {
        const disciplines = yield call(disciplineRequest, user)
        yield put(disciplineRequestSuccess(discipline))
      }
      
    } catch (error) {
      yield put(disciplineRequestError(error))
    }
  }
  
  function* disciplineLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        discipline
      } = action
      
      const current_discipline = yield call(disciplineLoad, user, discipline)
      yield put(disciplineLoadSuccess(current_discipline))
    } catch (error) {
      yield put(disciplineRequestError(error))
    }
  }
  
  function disciplineLoad(user, discipline) {
    const request = fetch(`${apiUrl}/${discipline}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* disciplineWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(DISCIPLINE_CREATING, disciplineCreateFlow),
      takeLatest(DISCIPLINE_UPDATING, disciplineCreateFlow),
      takeLatest(DISCIPLINE_REQUESTING, disciplineRequestFlow),
      takeLatest(DISCIPLINE_LOADING, disciplineLoadFlow),
    ]
  }
  
  export default disciplineWatcher