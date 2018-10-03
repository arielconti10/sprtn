import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Full from '../../../../src/template/containers/Full/Full'
import Dashboard from '../../../template/views/Dashboard/Dashboard';

export default class Logout extends Component {
    componentWillMount() {
        sessionStorage.removeItem("token_type");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("expires_in");
        sessionStorage.removeItem("block_fields");
        sessionStorage.removeItem("user_email");
        sessionStorage.removeItem("user_fullName");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("user_name");
        sessionStorage.removeItem("user_userName");
        sessionStorage.removeItem("rules");
        sessionStorage.removeItem("superior");
        sessionStorage.removeItem("role_name");
        sessionStorage.removeItem('sso_token');

        //limpa o localStorage antes de redirecionar
        localStorage.clear();

        // window.location.href = "/#/login";
        // window.location.reload();

        //força o redirect como manual
        window.location.replace('/');
    }
    render() {
        return (
            <div id="">
            </div>
        )
    }
}