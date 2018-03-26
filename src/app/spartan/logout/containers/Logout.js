import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'

import '../../css/site.css';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../template/components/content/contentHeader'
import Content from '../../../template/components/content/content'
import Row from '../../../template/components/common/row'
import Grid from '../../../template/components/common/grid'

import content from '../../../template/components/content/content';
import InputCustomize from '../../../template/components/content/InputCustomize';

import Datatable from '../../../template/components/tables/Datatable';
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components';
import axios from 'axios'

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