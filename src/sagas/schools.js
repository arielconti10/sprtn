import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'

  import {
    setSchool, updateLoader
  } from '../actions/school'
    
  const apiUrl = `${process.env.API_URL}/school`
  
  // We'll use this function to redirect to different routes based on cases
  import {
    createHashHistory
  } from 'history'

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

  /**
   * realiza a busca de uma escola de acordo com o seu ID
   * @param {Object} user usuário corrent
   * @param {Integer} school_id ID da escola a ser procurada
   * @return {Object} escola encontrada
   */
    function findSchool(user, school_id) {
        const url = `${apiUrl}/${school_id}`
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

    function* loadSchoolFlow(action) {
        yield put(updateLoader(true));
        
        const school = yield call(findSchool, action.user, action.school_id); 
        yield put(setSchool(school.data));
        
        yield put(updateLoader(false));
    }
  
    function* schoolWatcher() {
        // each of the below RECEIVES the action from the .. action
        yield [
            takeLatest("LOAD_SCHOOL_FLOW", loadSchoolFlow),
        ]
    }
  
  export default schoolWatcher