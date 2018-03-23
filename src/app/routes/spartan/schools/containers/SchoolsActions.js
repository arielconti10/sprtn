import axios from 'axios'
import { reset as resetForm, initialize } from 'redux-form'

import States from './SchoolsStates'

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFjN2U0NGY1YjdkZTZmMzEyODJlYmQyOGZjODYxMjQ4ZGMyNDdjN2NmNzY3ZGMzNjI1NTBjNTQ4MzlmNjYyYWEyMjYzMjNjYWMwNzEwOTdhIn0.eyJhdWQiOiIyIiwianRpIjoiYWM3ZTQ0ZjViN2RlNmYzMTI4MmViZDI4ZmM4NjEyNDhkYzI0N2M3Y2Y3NjdkYzM2MjU1MGM1NDgzOWY2NjJhYTIyNjMyM2NhYzA3MTA5N2EiLCJpYXQiOjE1MjE4MDIyMzMsIm5iZiI6MTUyMTgwMjIzMywiZXhwIjoxNTIxODg4NjMzLCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.MxxKiHgB9kURudINfRXF60Hlj2dYUgbw9eoQENBpVAXe6uI9jXrAX9d-nnKotBvBrRPg70X1wqs8G4F6YUrM_V9GSqWIlhodI3sPw4cQkNMb439oEguw_h-k3s9mFqMC_gjReIrStTQY-KeBWyWUdPLjz0g_pyFMkLJqAZfiRzfAXtTzUdhVS-U_aldEF0GT6eMipVC_Q6rkuEO5lygLPylUrCK1LTGyQL6etTEIAd_tD7RH1iXT9TJ8BkbdU8QqrXZbDPhT97GCaf8eBm3zqaRennoo9vCm9fnyIPNZg-rOGfiGAqHzxktdlrd2BOFzUos0kkmv8vmFjGBdO5d5Lpbk7gTkrk12EdtrqVo5KYzbwpviIkzIfIai49Xs_1hEVDe-_V0CqlpC8YQlK56GhLP3ABDLZpw2-JB-8a-y8udKqABwSsuZpoVzGLSP1Sk5J0CYfxZhqP8ULHqLHzOXnx_ZypgPMw6tnpP0cE0wzGMGDXwVJS1KvlCfHZpAoEyfIYkl9OEvZtYGf628GeB7g93Z2Zq2uyLON8G9wJyV5i0KCvC0eDJaiRLsjPXvmyYd15lh-hfvZgBHh4PiW2o8UNEsd6yEM8pRoWOlwYPiGQsdezoQfyzz1bXEfLVci41k7nvCreXhn_zK5B9aUYEtlvOs9tzC_1HaufI1bqgqcFw'

const URL = 'http://hapi.spartan.ftd.com.br/api/school'

export const getSchoolsList = (paginate) => {
    return (dispatch, getState) => {
        const schoolType = 'Particular'
        //const page = paginate ? paginate : '1'
        const page = paginate || getState().schoolsList.page

        console.log(`${URL}?school_type.name=${schoolType}&page=${page}`)

        axios.get(`${URL}?school_type.name=${schoolType}&page=${page}`, { headers: { Authorization: `Bearer ${token}` }})
            .then(resp => {console.log('getSchoolsList - resp', resp)
                          dispatch({ type: States.SCHOOLS_LIST_FETCHED,
                                     payload: resp.data })})
    }
}

export const nameSearch = () => {

}

export const stateSearch = () => {

}
export const citySearch = () => {

}
export const studentsSearch = () => {

}

export const getInitial = (page) => {
    const schoolType = 'Particular'
    const response = setTimeout(function() {
        axios.get(`${URL}?school_type.name=${schoolType}&page=${page}`, { headers: { Authorization: `Bearer ${token}` }}).then(resp => {console.log('getInitial - resp', resp); return resp.data})
     }, 1000)

    return response
}