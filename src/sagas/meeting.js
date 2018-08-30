import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
  } from '../actionTypes/meeting'
  
  import {
    setMeetingProfile, setMeetingUnified, setMeetingDate, setMeetingShifts, setMeetingShiftId,
    setSubmitedMeeting
  } from '../actions/meeting'
  
  
  // We'll use this function to redirect to different routes based on cases
  import {
    createHashHistory
  } from 'history'

  const apiUrl = `${process.env.API_URL}/school-secretary`
  const apiShift = `${process.env.API_URL}/shift`

  
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

/**
 * realiza o mapeamento para o Select
 * @param {Array} array_data lista a ser mapeada
 * @return {Array} final_map lista mapeada
 */
function mapToSelect(array_data) {
    let final_map = [];

    array_data.map(item => {
        const label = `${item.name}`;
        const object_map = {value: item.id, label};
        final_map.push(object_map);
    })
    
    return final_map;
}

/**
 * realiza a inserçāo de uma reuniāo
 * @param {Object} user dados do usuário corrent
 * @param {Object} meeting dados da reuniāo a ser inserida
 * @return {Object} handleRequest dados da requisiçāo realizada
 */
function insertMeeting(user, meeting) {
    const url = `${apiUrl}`
    
    const request = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
        },
        body: JSON.stringify(meeting)
    })
    
    return handleRequest(request)
}

/**
 * realiza a listagem de turnos
 * @param {Object} user dados do usuário
 * @return {Array} handleRequest resultado da busca
 */
function getShifts(user) {
    const url = `${apiShift}`
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

  function* setMeetingProfileFlow(action) {
      yield put(setMeetingProfile(action.profileId));
  }

  function* setMeetingUnifiedFlow(action) {
      yield put(setMeetingUnified(action.unifiedId));
  }

    function* changeMeetingDateFlow(action) {
        yield put(setMeetingDate(action.meetingDate));
    }

    function* loadMeetingShiftsFlow(action) {
        const shifts = yield call(getShifts, action.user);
        const shiftsMaped = yield call(mapToSelect, shifts.data);
        yield put(setMeetingShifts(shiftsMaped));
    }

    function* changeMeetingShiftFlow(action) {
        yield put(setMeetingShiftId(action.shiftId));
    }

    function* insertSchoolMeetingFlow(action) {
        try {
            const insertedMeeting = yield call(insertMeeting, action.user, action.meeting);
            
            if (insertedMeeting) {
                alert('Dados salvos com sucesso!');
            }
        } catch (error) {
            console.log(error);
        }
    }

  function* distributioneWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
        takeLatest("SET_MEETING_PROFILE_FLOW", setMeetingProfileFlow),
        takeLatest("SET_MEETING_UNIFIED_FLOW", setMeetingUnifiedFlow),
        takeLatest("CHANGE_MEETING_DATE_FLOW", changeMeetingDateFlow),
        takeLatest("LOAD_MEETING_SHIFTS_FLOW", loadMeetingShiftsFlow),
        takeLatest("CHANGE_MEETING_SHIFT_FLOW", changeMeetingShiftFlow),
        takeLatest("INSERT_SCHOOL_MEETING_FLOW", insertSchoolMeetingFlow)
    ]
  }
  
  export default distributioneWatcher