import { call, put, takeLatest } from 'redux-saga/effects'

// import { handleApiErrors } from '../lib/api-errors'

import { mapPieChart } from '../app/common/ChartHelper'
import axios from '../app/common/axios';
import {
  // INDICATORS_CREATING, 
  INDICATORS_REQUESTING,
} from '../actionTypes/indicators'

import {
  indicatorsRequestSuccess,
  indicatorsRequestError,
} from '../actions/indicators'

const apiUrl = `${process.env.API_URL}`

const schools = [
    { "value": "PARTICULAR", "label": "Particular" },
    { "value": "PUBLICO", "label": "Público" },
    { "value": "SECRETARIA", "label": "Secretaria" }
]

// Nice little helper to deal with the response
// converting it to json, and handling errors
function handleRequest (request) {
  return request
    // .then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

function contributorsRequestApi (client) {
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

function getUrlSearch(baseURL) {
    let concatURL = baseURL;
    if (this.state.hierarchy_id.value && this.state.hierarchy_id.value !== "") {
        const hierarchy_id = this.state.hierarchy_id.value;
        concatURL = concatURL + `?filter[user_id][]=${hierarchy_id}`;
    }

    return concatURL;
}

function getSchoolTypes() {
    let baseURL = `${apiUrl}/indicator/school/type`;
        // baseURL = this.getUrlSearch(baseURL);

    // const request = fetch(baseURL, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer ' + sessionStorage.getItem('access_token') || undefined,
    //     }
    // })    

    // return handleRequest(request)

    return axios.get(baseURL).then(result => {
        console.log(result)

        const final_array = [];

        final_array[0] = ["LEGENDA", "%"];
        types.map(item => {
            selected.map(item_search => {
                if (item_search.value.indexOf(item[0]) !== -1) {
                    final_array.push(item);
                }
            })
        })

        const general_total = final_array.reduce( (accum, curr) => curr[1] !== '%'?accum + curr[1]:0, 0 );
        this.setState( { [ selector_total ]: formatNumber(general_total) } );


        if (final_array.length >= 1) {
            this.setState( { [selector] : final_array }, () => {
                this.drawCustomOptions(final_array, selector_options);
                // this.drawCustomOptions(final_array, selector);
            });
            
        }

        return general_total
    })
}

function getStudentTypes() {
    let baseURL = `${apiUrl}/indicator/student/school-type`;
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

function getContacts() {
    let baseURL = `${apiUrl}/indicator/school/contact`;
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

function getActions() {
    let baseURL = `${apiUrl}/indicator/action/total`;
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

function getCoverage() {
    let baseURL = `${apiUrl}/indicator/school/coverage`;
        // baseURL = this.getUrlSearch(baseURL);
        
    return axios.get(baseURL).then(response => {
        let coverage = response.data.data
        let array_chart = [];
    
        if (coverage && coverage.length > 0) {
            coverage.map(item => {
                console.log(item)
                if (item.school_type.length > 0) {
                    const array_tmp = [item.school_type, parseFloat(item.total)];
                    array_chart.push(array_tmp);
                }
            });
        }
    
        array_chart.sort(function (a, b) {
            if(a[0] < b[0]) return -1;
            if(a[0] > b[0]) return 1;
            return 0;
        });
    
        array_chart.unshift(["Tipos de Escola", "%"]);

        return array_chart
    })
}



function* indicatorsRequestFlow (action) {
  try {
    const contributors = yield call(contributorsRequestApi)    
    const schoolTypes = yield call(getSchoolTypes)
    const studentTypes = yield call(getStudentTypes)
    const contacts = yield call(getContacts)
    const actions = yield call(getActions)
    const coverage = yield call(getCoverage)

    // dispatch the action with our indicators!
    yield put(indicatorsRequestSuccess(contributors, schools, schoolTypes, studentTypes, contacts, actions, coverage))

  } catch (error) {
    yield put(indicatorsRequestError(error))
  }
}

function* indicatorsWatcher () {
  // each of the below RECEIVES the action from the .. action
  yield [
    // takeLatest(WIDGET_CREATING, widgetCreateFlow),
    takeLatest(INDICATORS_REQUESTING, indicatorsRequestFlow),
  ]
}

export default indicatorsWatcher
