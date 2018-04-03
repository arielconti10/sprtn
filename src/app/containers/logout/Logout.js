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
        window.location.href = "/#/login";
    }
    render() {
        return ( 
            <div id="">
            </div>
        )
    }
}