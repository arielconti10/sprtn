import axios from 'axios'
import { reset as resetForm, initialize } from 'redux-form'

import States from './SchoolsStates'

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZkOTJhNjY0MmMzZWE2MDZjOWE3MGE2N2Y0NzkzNjRjN2NlOTViODJlNmMxOWNhMjY5ODkyYjEzYjAzMjBjYWZiYzQ1MjdlOTkxOTNmYTYxIn0.eyJhdWQiOiIyIiwianRpIjoiNmQ5MmE2NjQyYzNlYTYwNmM5YTcwYTY3ZjQ3OTM2NGM3Y2U5NWI4MmU2YzE5Y2EyNjk4OTJiMTNiMDMyMGNhZmJjNDUyN2U5OTE5M2ZhNjEiLCJpYXQiOjE1MjEyMDQxODMsIm5iZiI6MTUyMTIwNDE4MywiZXhwIjoxNTIxMjkwNTgzLCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.zUqdVyXhfw-oZ4-Q-OcdyBrVEj_4gHq_kRqGCUVGlKgin-mLd6cueQqwIuRVylxGoCzDQcT4GV__0dmoViTOXbrHOlDvXHmszalhQfndCbO0lhWjY5_a52mvHGipcR1T2CSxf_Rp7i4BI7QcRA6XUwDLles_5bLHhRY_0XM7_H24k10ZoMg_8bWiZxgyt4h2_eA3MNks7zZh2xy9W3p18n8TVOF3V-ZvPTeFrIXIqvv_iIyvIUbbNQRNry3CU0yOJrP3aH8CHo6MtbtqQeMNyRX-D1XU0Q9Z7R9tC7Ck3V1ptUBL4ET3yxQicyJZDcC95bQawKjm8ZXU6ZsLJswaYKD7M78xZZgJ8JrzPl4n9d82GpyTibarLK-c80CqUAJxT6PVjB0DFn8Jj-JGQMLAqzP94cea5t4sXj_0FO7ofFrYYiU_reFwcTwvD4CWvr8bx70E93aTYGWb5XtAP9XKErF_6Z04ZWqcRQViTydSUCDKHZ1bz0Rd-M65J2sjlBVXN6_vEK8UOU_BSV3fUEVlkjf-KGcdDT0JTMRA_z-UnsT42igXeQgRnToFYJMr3C2pLfUejmEMJ0VENZDtNOgftVHQjjD9G-1wcS3FSiO1DLdJJQqXy8zrnr3A9x4qiRjpVYAUvlOQdviM05GNs4ipBiB0brIVSuqT7IlREQUq4Ls'

const URL = 'http://hapi.spartan.ftd.com.br/api/school?school_type.name=Particular&page=1'

export const getSchoolsList = () => {
    return dispatch => {
        axios.get(URL, { headers: { Authorization: `Bearer ${token}` } })
            .then(resp => dispatch({ type: States.SCHOOLS_LIST_FETCHED,
                                     payload: resp.data }))
    }
}