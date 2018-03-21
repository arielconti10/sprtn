import axios from 'axios'
import { reset as resetForm, initialize } from 'redux-form'

import States from './SchoolsStates'

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJkNTIyYzk1NmJjZTRiMGJmODk0YWExZWE1ZDZiODViZWRmODkyOGFlYzZmYzg5YWJjMGJiYTA0OTBkZDNlN2NhYWI3MGIwOTI3Y2EwMDRlIn0.eyJhdWQiOiIyIiwianRpIjoiMmQ1MjJjOTU2YmNlNGIwYmY4OTRhYTFlYTVkNmI4NWJlZGY4OTI4YWVjNmZjODlhYmMwYmJhMDQ5MGRkM2U3Y2FhYjcwYjA5MjdjYTAwNGUiLCJpYXQiOjE1MjE2NjI5NTAsIm5iZiI6MTUyMTY2Mjk1MCwiZXhwIjoxNTIxNzQ5MzUwLCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.JqjGXx9mDPJFZHhFZnWPmSjmr9Ja9Dhv5fz1LTV0smdXKULnIhV7NKJxq7RFHfko2suYIkfRgG7PYhn9vs4-YE8XReh4inGPw4xeGtCKCz0dluPNm7xheqJMhCwJNtMJJbR1uSbYcpglwzfQ1SyCXz6HUn2zhAehP1fp0hTof08kn9EQkv2rRvmmcRDtPyRq7bj9tx2js_Iw6TbonjBSnoZ9jtnX3TBxkP-MlYKRqusEBWzKcZBnGfDrF-Lfw_YtnP6b2YyHkyp734WBJDwAau52-OjaRIXut7wOz0VK6UlgNSNspWGhsaEDvKYlJUEEtBXVezLNc86Bp3pWZDsyL_dX1W2PSUtkkxt0nVGojFVjQoow5brGzGVIW7JW4zPyJgsDgk4BXyC_0A81Jr5aDDNHALTmkO55D9vj8IpCk_cRETU7Isx1OKtRVyjMcqwUCN5cd2ebMFsyuS5rwKAf9ZfvzIrrkjBzjFvA5K8d1cuepn6mxjzzbyqWA9I_-QYNDkIhxo233fa8TrudKe-j6MEu8vNUBEftM4IWj6LLYLHvZ5WHh83RQ9u_KHNtp8YK3IQvTn51LXeHeSNrqxBWciNz8b3MQsZO8qTmYvBKUWxxgq63QKwdlobCj1tuB5bQ5cWCLrcYoE-wH0icbtMadpHRBo4GNbo_2JqGNvZcC_c'

const URL = 'http://hapi.spartan.ftd.com.br/api/school'

export const getSchoolsList = (paginate) => {
    return (dispatch, getState) => {
        const schoolType = 'Particular'
        //const page = paginate ? paginate : '1'
        console.log(getState())
        const page = paginate || getState().schoolsList.page

        console.log(`${URL}?school_type.name=${schoolType}&page=${page}`)

        axios.get(`${URL}?school_type.name=${schoolType}&page=${page}`, { headers: { Authorization: `Bearer ${token}` }})
            .then(resp => {console.log('resp', resp)
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
    const response = axios.get(`${URL}?school_type.name=${schoolType}&page=${page}`, { headers: { Authorization: `Bearer ${token}` }})

    return response
}