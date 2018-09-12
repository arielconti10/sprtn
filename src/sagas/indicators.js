import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects'
// import { handleApiErrors } from '../lib/api-errors'
import {
  mapPieChart
} from '../app/common/ChartHelper'

import {
  // INDICATORS_CREATING, 
  INDICATORS_REQUESTING,
  UPDATE_RING_LOAD,
} from '../actionTypes/indicators'

import {
  indicatorsRequestSuccess,
  changeHierarchySuccess,
  indicatorsRequestError,
  updateRingLoad,
} from '../actions/indicators'

const apiUrl = `${process.env.API_URL}`

const schools = [{
    "value": "PARTICULAR",
    "label": "Particular"
  },
  {
    "value": "PUBLICO",
    "label": "Público"
  },
  {
    "value": "SECRETARIA",
    "label": "Secretaria"
  }
]

// Nice little helper to deal with the response
// converting it to json, and handling errors
function handleRequest(request) {
  return request
    // .then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => {
      throw error
    })
}

function contributorsRequestApi(client) {
  const url = `${apiUrl}/hierarchy/childrens`
  const request = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // passe our token as an "Authorization" header
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    },
  })

  return handleRequest(request)
}

function getUrlSearch(baseURL, hierarchy_id) {
  let concatURL = baseURL;

  if (hierarchy_id && hierarchy_id !== "") {
    // const hierarchy_id = this.state.hierarchy_id.value;
    concatURL = concatURL + `?filter[user_id][]=${hierarchy_id}`;
  }

  return concatURL;
}

function getSchoolTypes(hierarchy_id = null) {
  let baseURL = `${apiUrl}/indicator/school/type`;
  baseURL = getUrlSearch(baseURL, hierarchy_id)

  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)
}

function* changeHierarchyFlow(action) {
  yield put(updateRingLoad(true));

  const actions = yield call(getActionsRealized, action.hierarchy.value)
  const actionTypes = yield call(getActionTypes, action.hierarchy.value)
  const schoolTypes = yield call(getSchoolTypes, action.hierarchy.value)
  const contacts = yield call(getContacts, action.hierarchy.value)
  const studentTypes = yield call(getStudentTypes, action.hierarchy.value)
  const totalSchools = yield call(getTotalSchools, schoolTypes)
  const totalStudents = yield call(getTotalStudents, studentTypes)
  const total_action = yield call(getActions, action.hierarchy.value)

  const dataSchoolTypes = yield call(getDataSchoolType, schoolTypes)
  // const dataCoverage = yield call(getDataCoverage, coverage)
  const dataActions = yield call(getDataActions, actions)
  const dataActionTypes = yield call(getDataActionTypes, actionTypes)

  yield put(changeHierarchySuccess(actions, actionTypes, contacts, studentTypes, schoolTypes, totalSchools, totalStudents, total_action, dataSchoolTypes, dataActions, dataActionTypes))
  yield put(updateRingLoad(false));

}

function getStudentTypes(hierarchy_id = null) {
  let baseURL = `${apiUrl}/indicator/student/school-type`;
  baseURL = getUrlSearch(baseURL, hierarchy_id);

  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)
}

function getContacts(hierarchy_id = null) {
  let baseURL = `${apiUrl}/indicator/school/contact`;
  baseURL = getUrlSearch(baseURL, hierarchy_id);

  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)
}

function getActions(hierarchy_id = null) {
  let baseURL = `${apiUrl}/indicator/action/total`;
  baseURL = getUrlSearch(baseURL, hierarchy_id);

  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)
}

function getCoverage() {
  let baseURL = `${apiUrl}/indicator/school/coverage`;
  // baseURL = this.getUrlSearch(baseURL);

  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)

}

function getTotalSchools(schools) {
  let total = 0;

  Object.keys(schools.data).map(function (key, index) {
    total += schools.data[key].total;
  });

  return total;
}

function getTotalStudents(students) {
  let total = 0;

  Object.keys(students.data.total).map(function (key, index) {
    total += students.data.total[key].total;
  });

  return total;
}

function getTotalActions(actions) {
  console.log(actions)
  let total = 0;

  Object.keys(actions.data.total).map(function (key, index) {
    total += actions.data.total[key].total;
  });

  return total;
}

function getDataSchoolType(schoolTypes) {
  const data_school_type = mapPieChart("Tipos de Escola", "school_type", "total", schoolTypes.data);

  return data_school_type
}

function getDataCoverage(coverage) {
  const data_coverage = mapPieChart("Tipos de Escola", "school_type", "total", coverage.data);
  return data_coverage
}

function getDataActions(actions) {
  const data_actions = mapPieChart("Ações", "name", "total", actions.data)
  return data_actions
}

function getDataActionTypes(actionTypes) {
    const data_actions = mapPieChart("Tipos de Escola", "school_type", "total", actionTypes.data);
    console.log(data_actions)
    return data_actions
  }

function getActionsRealized(hierarchy_id = null) {

  let baseURL = `${apiUrl}/indicator/school/action`;
  baseURL = getUrlSearch(baseURL, hierarchy_id);

  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)
}

function getActionTypes(hierarchy_id = null) {
  let baseURL = `${apiUrl}/indicator/action/school-type`;
  baseURL = getUrlSearch(baseURL, hierarchy_id);
  
  const request = fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    }
  })

  return handleRequest(request)
//   axios.get(action)
//     .then(res => {
//       const result = res.data.data;
//       const data_action_type = mapPieChart("Tipos de Escola", "school_type", "total", result);

//       this.drawCustomOptions(data_action_type, "options_action_school");

//       this.setState({
//         data_action_type,
//         action_type_initial: data_action_type
//       });
//     })
//     .catch(error => {
//       const response = error.response;
//       this.setState({
//         msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}`
//       });
//     })
}


function* indicatorsRequestFlow(action) {
  yield put(updateRingLoad(true));

  try {

    const contributors = yield call(contributorsRequestApi)
    const schoolTypes = yield call(getSchoolTypes)
    const studentTypes = yield call(getStudentTypes)
    const actions = yield call(getActionsRealized)
    const actionTypes = yield call(getActionTypes)
    const contacts = yield call(getContacts)
    const coverage = yield call(getCoverage)
    const total_action = yield call(getActions)
    const totalSchools = yield call(getTotalSchools, schoolTypes)
    const totalStudents = yield call(getTotalStudents, studentTypes)
    const dataSchoolTypes = yield call(getDataSchoolType, schoolTypes)
    const dataCoverage = yield call(getDataCoverage, coverage)
    const dataActions = yield call(getDataActions, actions)
    const dataActionTypes = yield call(getDataActionTypes, actionTypes)
    // dispatch the action with our indicators!
    yield put(
      indicatorsRequestSuccess(
        dataActions,
        actions,
        actionTypes,
        contributors,
        schools,
        schoolTypes,
        studentTypes,
        contacts,
        coverage,
        total_action,
        totalSchools,
        totalStudents,
        dataSchoolTypes,
        dataCoverage,
        dataActionTypes
      )
    )

    yield takeLatest("CHANGE_HIERARCHY_REQUESTING", changeHierarchyFlow);
    // yield takeLatest("CHANGE_SECTOR_FLOW", changeSectorFlow);

    yield put(updateRingLoad(false));

  } catch (error) {
    yield put(indicatorsRequestError(error))
    yield put(updateRingLoad(false));
  }
}

function* indicatorsWatcher() {
  // each of the below RECEIVES the action from the .. action
  yield [
    // takeLatest(WIDGET_CREATING, widgetCreateFlow),
    takeLatest(INDICATORS_REQUESTING, indicatorsRequestFlow),
  ]
}

export default indicatorsWatcher