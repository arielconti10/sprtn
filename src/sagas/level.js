import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    LEVEL_CREATING,
    LEVEL_UPDATING,
    LEVEL_REQUESTING,
    LEVEL_LOADING,

  } from '../actionTypes/level'
  
  import {
    levelCreateSuccess,
    levelCreateError,
    levelRequestSuccess,
    levelRequestError,
    levelLoadSuccess,
    levelUpdateSuccess,
    disciplineLevelSuccess,
  } from '../actions/level'
  
  const apiUrl = `${process.env.API_URL}/level`
  
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
  
  function levelCreate(user, level) {
    level.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(level),
    })
  
    return handleRequest(request)
  }
  
  function levelUpdate(user, level, active) {
      
    let data = {
      'name': level.name,
      'active': level.active,
      'code': level.code,
    }

    const url = `${apiUrl}/${level.id}`
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
  
  function* levelCreateFlow(action) {
    try {
      const {
        user,
        level,
      } = action
      if (level.id !== undefined) {
        const updatedlevel = yield call(levelUpdate, user, level)
        yield put(levelUpdateSuccess(updatedlevel))
      } else {
        const createdlevel = yield call(levelCreate, user, level)
        yield put(levelCreateSuccess(createdlevel))
  
      }
  
      history.push('/cadastro/niveis')
  
    } catch (error) {
      // same with error
      yield put(levelCreateError(error))
    }
  }
  
  function levelRequest(user) {
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
  
  function* levelRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user
      } = action
    
      const levels = yield call(levelRequest, user)
      yield put(levelRequestSuccess(levels))
      
    } catch (error) {
      yield put(levelRequestError(error))
    }
  }
  
  function* levelLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        level
      } = action
      
      const current_level = yield call(levelLoad, user, level)
      yield put(levelLoadSuccess(current_level))
    } catch (error) {
      yield put(levelRequestError(error))
    }
  }
  
  function levelLoad(user, level) {
    const request = fetch(`${apiUrl}/${level}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', 
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
//   function loadDisciplineByLevel(level) {
//     const url = `${apiUrl}`
//     const request = fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         // passe our token as an "Authorization" header
//         Authorization: 'Bearer ' + user.access_token || undefined,
//       },
//     })
  
//     return handleRequest(request)
//   }

//   function loadDisciplineByLevelFlow(level) {
//       try{
//         const discipline_levels = yield call(loadDisciplineByLevel(level))

//         yield put (disciplineByLevelSuccess(discipline_levels))
//       } catch (error) { 
//           yield put(levelRequestError(error))
//       }
//   }

  function* levelWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(LEVEL_CREATING, levelCreateFlow),
      takeLatest(LEVEL_UPDATING, levelCreateFlow),
      takeLatest(LEVEL_REQUESTING, levelRequestFlow),
      takeLatest(LEVEL_LOADING, levelLoadFlow),
    //   takeLatest(DISCIPLINE_LEVEL_REQUESTING, loadDisciplineByLevelFlow),
    ]
  }
  
  export default levelWatcher