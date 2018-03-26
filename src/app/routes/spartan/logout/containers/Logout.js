import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'

import '../../css/site.css';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../../components/content/contentHeader'
import Content from '../../../../components/content/content'
import Row from '../../../../components/common/row'
import Grid from '../../../../components/common/grid'

import content from '../../../../components/content/content';
import InputCustomize from '../../../../components/content/InputCustomize';

import Datatable from '../../../../components/tables/Datatable';
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components';
import axios from 'axios'

export default class Logout extends Component {
    componentWillMount() {
        sessionStorage.removeItem("token_type");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("expires_in");
        window.location.href = "/#/spartan/login";
    }
    render() {
        return ( 
            <div id="">
            </div>
        )
    }
}