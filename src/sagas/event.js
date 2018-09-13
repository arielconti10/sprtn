import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
  } from '../actionTypes/event'
  
  import {
    setEventCollapse, setEventDate, setStartTime, setTime, setEventActions,
    setEventAction, setSchoolEvents, setSchoolEventInfo
  } from '../actions/event'

  import { formatDateToBrazilian } from '../app/common/DateHelper'

  
  const apiUrl = `${process.env.API_URL}/event`
  const apiAction = `${process.env.API_URL}/action`
  const apiSchool = `${process.env.API_URL}/school`
  
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

  /**
   * realiza a busca de ações de acordo com o tipo de identificaçāo
   * @param {Object} user dados do usuário
   * @param {String} identify texto de identificaçāo, por exemplo: PUBLICO, PARTICULAR, SECRETARIA
   * @return {Array} handleRequest resultado da busca
   */
  function searchActions(user, identify) {
    const url = `${apiAction}?filter[visit_type_school_type.school_type.identify]=${identify}`
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

/**
 * realiza a exclusāo/inativaçāo de um evento, de acordo com o ID
 * @param {Object} user usuário a ser autenticado
 * @param {Integer} contactId ID do evento a ser inativado
 * @return {Object} handleRequest retorno da request
 */
function deleteEvent(user, eventId) {
    const url = `${apiUrl}/${eventId}`
    const request = fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
        }
    });
    
    return handleRequest(request)
}

/**
 * realiza a busca de escola de acordo com o ID fornecido
 * @param {Object} user dados do usuário
 * @param {Integer} schoolId ID da escola a ser procurada
 * @return {Array} handleRequest resultado da busca
 */
function findSchool(user, schoolId) {
    const url = `${apiSchool}/${schoolId}`;
    const request = fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // passe our token as an "Authorization" header
            Authorization: 'Bearer ' + user.access_token || undefined,
        },
    })

    return handleRequest(request);
}

/**
 * realiza a busca de um evento de acordo com o ID fornecido
 * @param {Object} user dados do usuário
 * @param {Integer} eventId ID do evento a ser procurado
 * @return {Array} handleRequest resultado da busca 
 */
function findEvent(user, eventId) {
    const url = `${apiUrl}/${eventId}`;
    const request = fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // passe our token as an "Authorization" header
            Authorization: 'Bearer ' + user.access_token || undefined,
        },
    })

    return handleRequest(request);
}

/**
 * realiza o mapeamento de ações para que seja aplicado no Select2
 * @param {Array} actions lista com ações encontradas
 * @return {Array} actionsMaped ações mapeadas
 */
function mapActions(actions) {
    let actionsMaped = [];
    actions.map(item => {
        const tempObject = {value: item.id, label: item.name};
        actionsMaped.push(tempObject);
    })

    return actionsMaped;
}

/**
 * realiza a inserçāo de um evento
 * @param {Object} dados do usuário logado
 * @param {eventObject} dados do evento a serem inseridos
 * @return {Object} handleRequest retorno da request
 */
function insertEvent(user, eventObject) {
    const url = `${apiUrl}`
    
    const request = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
        },
        body: JSON.stringify(eventObject)
    })
    
    return handleRequest(request)
}

/**
 * realiza a atualizaçāo de um evento, de acordo com os dados e o ID
 * @param {Object} user dados de autenticaçāo do usuário
 * @param {Integer} eventId ID do evento
 * @param {Object} dataUpdate a serem atualizados
 * @return {Object} handleRequest retorno da request
 */
function updateEvent(user, eventId, dataUpdate) {
    const url = `${apiUrl}/${eventId}`
    const request = fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
        },
        body: JSON.stringify(dataUpdate),
    })
    
    return handleRequest(request)
}

  function* addEventFlow(action) {
      const newCollapse = !action.collapse;
      yield put(setEventCollapse(newCollapse));
  }

  function* changeEventDateFlow(action) {
      const dateStr = action.dateStr;
      yield put(setEventDate(dateStr));
  }

  function* openStartTimeFlow(action) {
      yield put(setStartTime(action.formStartTime));
  }

  function* changeTypeFlow(action) {
      yield put(setTime(action.formStartTime));
  }

  function* getEventActionsFlow(action) {
      const actions = yield call(searchActions, action.user, action.identify);
      const actionsMap = yield call(mapActions, actions.data);

      yield put(setEventActions(actionsMap));
  }

  function* changeEventActionFlow(action) {
      yield put(setEventAction(action.actionId));
  }

  function* loadEventsFlow(action) {
      const schoolEvents = action.schoolEvents;
      yield put(setSchoolEvents(schoolEvents));
  }

  function* deleteSchoolEventFlow(action) {
    try {
        const deletedEvent = yield call(deleteEvent, action.user, action.eventId);
        if (deletedEvent) {
            const school = yield call(findSchool, action.user, action.schoolId);
            const events = school.data.events;
              
            yield put(setSchoolEvents(events));
        }
    } catch (error) {
        console.log(error);
    }
  }

  function* activeSchoolEventFlow(action) {
    try {
       let eventInfo = action.eventInfo.original;
       eventInfo.school_id = action.schoolId;
       eventInfo.active = 1;

        const activedEvent = yield call(updateEvent, action.user, action.eventId, eventInfo);
        
        if (activedEvent) {
            const school = yield call(findSchool, action.user, action.schoolId);
            const events = school.data.events;
              
            yield put(setSchoolEvents(events));
        }
    } catch (error) {
        console.log(error);
    }
  }

  function* findSchoolEventFlow(action) {
    const eventObject = action.eventInfo;

    yield put(setEventCollapse(true));
    yield put(setSchoolEventInfo(eventObject));
    yield put(setEventDate(eventObject.start_date));
    yield put(setTime(eventObject.start_time));
    yield put(setEventAction(eventObject.action_id));
  }

  function* updateSchoolEventFlow(action) {
    try {
         const updatedEvent = yield call(updateEvent, action.user, action.eventId, action.eventObject);
         
         if (updatedEvent) {
             const school = yield call(findSchool, action.user, action.schoolId);
             const events = school.data.events;
               
             yield put(setSchoolEvents(events));
             yield put(setEventCollapse(false));
         }
     } catch (error) {
         console.log(error);
     }
  }

  function* insertSchoolEventFlow(action) {
    try {
        const insertedEvent = yield call(insertEvent, action.user, action.eventObject);
        
        if (insertedEvent) {
            const school = yield call(findSchool, action.user, action.schoolId);
            const events = school.data.events;
              
            yield put(setSchoolEvents(events));
            yield put(setEventCollapse(false));
        }
    } catch (error) {
        console.log(error);
    }
  }

  function* eventWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
        takeLatest("ADD_EVENT_FLOW", addEventFlow),
        takeLatest("CHANGE_EVENT_DATE_FLOW", changeEventDateFlow),
        takeLatest("OPEN_START_TIME_FLOW", openStartTimeFlow),
        takeLatest("CHANGE_TIME_FLOW", changeTypeFlow),
        takeLatest("GET_EVENT_ACTIONS_FLOW", getEventActionsFlow),
        takeLatest("CHANGE_EVENT_ACTION_FLOW", changeEventActionFlow),
        takeLatest("LOAD_EVENTS_FLOW", loadEventsFlow),
        takeLatest("DELETE_SCHOOL_EVENT_FLOW", deleteSchoolEventFlow),
        takeLatest("ACTIVE_SCHOOL_EVENT_FLOW", activeSchoolEventFlow),
        takeLatest("FIND_SCHOOL_EVENT_FLOW", findSchoolEventFlow),
        takeLatest("UPDATE_SCHOOL_EVENT_FLOW", updateSchoolEventFlow),
        takeLatest("INSERT_SCHOOL_EVENT_FLOW", insertSchoolEventFlow)

        // INSERT_SCHOOL_EVENT_FLOW
    ]
  }
  
  export default eventWatcher