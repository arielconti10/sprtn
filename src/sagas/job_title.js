import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    JOB_TITLE_CREATING,
    JOB_TITLE_UPDATING,
    JOB_TITLE_REQUESTING,
    JOB_TITLE_LOADING 
  } from '../actionTypes/job_title'
  
  import {
    job_titleCreateSuccess,
    job_titleCreateError,
    job_titleRequestSuccess,
    job_titleRequestError,
    job_titleLoadSuccess,
    job_titleUpdateSuccess,
  } from '../actions/job_title'
  
  const apiUrl = `${process.env.API_URL}/job-title`
  
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
  
  function job_titleCreate(user, job_title) {
    job_title.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(job_title),
    })
  
    return handleRequest(request)
  }
  
  function job_titleUpdate(user, job_title, active) {
    console.log(job_title)  
    let data = {
      'name': job_title.name,
      'active': job_title.active,
      'code': job_title.code,
      'job_title_type_id': job_title.job_title_type_id
    }

    const url = `${apiUrl}/${job_title.id}`
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
  
  function* job_titleCreateFlow(action) {
    try {
      const {
        user,
        job_title,
      } = action
      if (job_title.id !== undefined) {
        const updatedjob_title = yield call(job_titleUpdate, user, job_title)
        yield put(job_titleUpdateSuccess(updatedjob_title))
      } else {
        const createdjob_title = yield call(job_titleCreate, user, job_title)
        yield put(job_titleCreateSuccess(createdjob_title))
  
      }
  
      // history.push('/cadastro/cargos')
  
    } catch (error) {
      // same with error
      yield put(job_titleCreateError(error))
    }
  }
  
  function job_titleRequest(user) {
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
  
  function* job_titleRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        job_title
      } = action
  
      if(job_title.id !== undefined){
        const current_job_title = yield call(job_titleLoad, user, job_title)
        yield put(job_titleLoadSuccess(current_job_title))      
      } else {
        const job_title = yield call(job_titleRequest, user)
        yield put(job_titleRequestSuccess(job_title))
      }
      
    } catch (error) {
      yield put(job_titleRequestError(error))
    }
  }
  
  function* job_titleLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        job_title
      } = action
      
      const current_job_title = yield call(job_titleLoad, user, job_title)
      
      yield put(job_titleLoadSuccess(current_job_title))
    } catch (error) {
      yield put(job_titleRequestError(error))
    }
  }
  
  function job_titleLoad(user, job_title) {

    const request = fetch(`${apiUrl}/${job_title}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* job_titleWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(JOB_TITLE_CREATING, job_titleCreateFlow),
      takeLatest(JOB_TITLE_UPDATING, job_titleCreateFlow),
      takeLatest(JOB_TITLE_REQUESTING, job_titleRequestFlow),
      takeLatest(JOB_TITLE_LOADING, job_titleLoadFlow),
    ]
  }
  
  export default job_titleWatcher