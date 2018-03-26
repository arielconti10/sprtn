import axios from 'axios'
import { reset as resetForm, initialize } from 'redux-form'

import States from './SchoolsStates'

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImZlNmM2ZmM0MzBlZDVmMDVkZmIyNzgxNDY5ZmJkMmZkZGM3YzQyMmI2ZWFjMzIyNjMyOGViMmZkZTExMjkwZWZiN2NkNjA0ZWZmMDUzYTg0In0.eyJhdWQiOiIyIiwianRpIjoiZmU2YzZmYzQzMGVkNWYwNWRmYjI3ODE0NjlmYmQyZmRkYzdjNDIyYjZlYWMzMjI2MzI4ZWIyZmRlMTEyOTBlZmI3Y2Q2MDRlZmYwNTNhODQiLCJpYXQiOjE1MjE4MDk4MjQsIm5iZiI6MTUyMTgwOTgyNCwiZXhwIjoxNTIxODk2MjI0LCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.KhfmudO8IdsmRpRNphLbu2e7eiCtsHPxtBdi5bZuoxDnkr28ogfnY0-lEk07ndLUgE8urtuAoOqDeh29g8A3LBL6ySf_RQIiGvacU2miisveSEr3PzrmRA0XXWHWjpg7zM0mOvZtDY37dyu29pAtr0_7u12rz2V2y0w7hbfsmMk9Logm3DvqLIM3jnCG5oH6nFttMvbWQa2XTNNr0ZwY8r1jKqfmUZbvrp6g-Pq5TVsOkw7rcDc_cZJo4p41k2KgaW88_dGxnMgfLh8RiD3fPNdA_1h_faFXImEnm9UT-Y3f-q5U1oKwCrK8U0ibJLL_Gw8rkDuZecO1UiF8YQ-PdLBtlsHq2atzHL9sfThhG2CYVlwKL4kaHfeiGFhAR445ir7kSF5toLte6Ii7sclkHN1jyGu2EQYliYvXBQM_bpMZzfyzOtWOFg-m5Zy2ye4r-YmfjzUig3tZURIS0EVb4rKj2zbN-TxL82-ErcUt8FAQ7sYb9xbbeuiZrzdP2BaZGnqP9DwYzdcZsS25rIxNHaIH5cGpyfxn_zCPUaQLhvlLNe-TRrZ8Yy-B3fuGNmcQR12YI6M2FnA7pVUNS5oR3Qrwwjr2dwrX7YRumCpQAVc2tBvJKNw4rVKa1qk8dTS1XZ911uUv8YyNt0zaC4u_zbc7gw1G3TxwQu8v9f72MWw'

const URL = 'http://hapi.spartan.ftd.com.br/api/school'

export const getSchoolsList = (paginate, sizePerPage) => {
    return (dispatch, getState) => {
        const schoolType = 'Particular'
        const page = paginate || getState().schoolsList.page
        const sizePage = sizePerPage || 10

        axios.get(`${URL}?school_type.name=${schoolType}&page=${page}&paginate=${sizePage}`, { headers: { Authorization: `Bearer ${token}` }})
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