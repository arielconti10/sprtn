import axios from 'axios'
import { reset as resetForm, initialize } from 'redux-form'

import States from './SchoolsStates'

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc2M2MyYmYxOWYyNTIzY2RhOWM2NTJmMTAxOWJiNDJjMWY2ZmQ0MDAwYzBmMTg1ZmZkN2M0ODFkZmEyMzRkZjFhYTRjYjYxN2Y3ZjJjNDEwIn0.eyJhdWQiOiIyIiwianRpIjoiNzYzYzJiZjE5ZjI1MjNjZGE5YzY1MmYxMDE5YmI0MmMxZjZmZDQwMDBjMGYxODVmZmQ3YzQ4MWRmYTIzNGRmMWFhNGNiNjE3ZjdmMmM0MTAiLCJpYXQiOjE1MjE3NTcxNDksIm5iZiI6MTUyMTc1NzE0OSwiZXhwIjoxNTIxODQzNTQ5LCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.UvP2FYlEHja3rvyBGX7Nvo87icjyGFVI00VMk0cgaUkt7-OjgyqW-MWWuxoFPTUj0ZQbK6BONQ92ldXJU4cvCppStEUncxmD5Ws4GhhjnbiaGeOFTVfq3rktM8uiIf6jN_praAxMYInzJT1jeGX2BQ0dwnSzZDUq33YkVR8gGnFKHgywnr4Xn7Oxa30Tt-0WphCwPunSc7NST8KsJPJQKcAL38JpC1R11xMxA3PAiwpK3c_BS3FD7fqzGvoEPycB2wXq2-YpkP1BhOMFRui8i-ASKbMtbnb7pqzHiUK0Youbx1v2xGrUF98skofwAuPPihEqMSA-STKdyv4d5HiunVOnc7vnodv0NFufTivjQfHdXZpGRa1IZ3cBfZNJZniad-dGx-u6PrO5hEG1qyhnrdhNyOMmEeQCB1ldpOOPlz8cPqPEJqOR6NP4xKODWK1iUFVgg3X4RGNFP9Ne50beaL0FwoUMCEONFZG4fshH9QJLISC8DllMn2n0B7x9rdlc8bwFS8xsD1X31ZIL9Dp7JEFSdKpUapLdxO0IpfWWvPKaQu3NRHLqPss12BmmM28P14Q_JZe4nMamcHOFBP_o3LerT3yVb3G7rkWfB4z_XlDRmh4m_gmpQ4C0rRAS7hOFDTzelNT-oyHXn_5jTP_PqZaqckFUfs_eGFU4aPX-f08'

const URL = 'http://hapi.spartan.ftd.com.br/api/school'

export const getSchoolsList = (paginate) => {
    return (dispatch, getState) => {
        const schoolType = 'Particular'
        //const page = paginate ? paginate : '1'
        //console.log(getState())
        const page = paginate || getState().schoolsList.page

        //console.log(`${URL}?school_type.name=${schoolType}&page=${page}`)

        axios.get(`${URL}?school_type.name=${schoolType}&page=${page}`, { headers: { Authorization: `Bearer ${token}` }})
            .then(resp => {//console.log('resp', resp)
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