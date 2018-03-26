import axios from 'axios'
import { reset as resetForm, initialize } from 'redux-form'

import States from './SchoolsStates'

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRiOTI1OGJkYWY2YTExMWFkNTk2MmQ1YTQ3Yjc0YmZkZTdhMjkyOWUwZTJlZmYwNDU4NWE3OTMwMGMyNGY2YmY2MWZkMzljYzgzYmFlYWE3In0.eyJhdWQiOiIyIiwianRpIjoiNGI5MjU4YmRhZjZhMTExYWQ1OTYyZDVhNDdiNzRiZmRlN2EyOTI5ZTBlMmVmZjA0NTg1YTc5MzAwYzI0ZjZiZjYxZmQzOWNjODNiYWVhYTciLCJpYXQiOjE1MjE0ODY3NTEsIm5iZiI6MTUyMTQ4Njc1MSwiZXhwIjoxNTIxNTczMTUxLCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.OMC31qXCf2mG8aqABk5QMQUyTgDaf_RFhT_4LCoMj6K1zYkkKEsG8Dzf_Am2_haLqHIorWGalb0-UtfcXAKYMnLZykT4Ru2LbdxnTQcF48UWZ2s3htHvES6LlFzr5f_WsGM9dGesAaqIOFU02tU29bulj1cslrQHuwmGa26KRfb4w3rxx-w5Mm7vYbuq2ssb5bR_3iaW09x7Sp0THDkS8WlK3cF4j7P1ZBwu3QfrT9nY0arngOMQwLi3gEe0t_R_FomoQxwfhMXmC8mXerS9-cTy4Vhj2bcAXfA40n0O_BvDOeRQCX7jg6hauPA79774c3b8GBBylMmWCk-7q35EmNGgpgqPM9AxSuDLZ_vEIDBJaUxl_jGQM_-DN9ig1JlYAo1lksljGeOkFCcHAxGm-FGsrzYIQshdSZ5i5sWvvUHMWJTMchl-HWg7PU4AUSrx9nrmgSoG1U6kl2NBsGXCi339rdasB8gXng7gmuOefcFjudiLeLY8CXu2y4ROLmrj5kOOqvJcidtIKH_flj1YrfB6F_vhduvDEn7HllNSSSMU3H8UwvIzYhE-bLJU7KHabY5VvSjBZr472o9IjmA57iC0qEdzCOQBZiNhVYKxpQErxreBgQFDT24cYpIM_yFHDv8SUUm137ysGLIgmB5n_AnZG06jtdVJ7mKZCLvapso'

const URL = 'http://hapi.spartan.ftd.com.br/api/school?school_type.name=Particular'

export const getSchoolsList = () => {
    return dispatch => {
        axios.get(URL, { headers: { Authorization: `Bearer ${token}` }, 
                         data: { 'school_type.name': 'Particular', 'page': '1' }                        
            }).then(resp => dispatch({ type: States.SCHOOLS_LIST_FETCHED,
                                     payload: resp.data }))
    }
}