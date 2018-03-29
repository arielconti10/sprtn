import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../template/components/content/contentHeader'
import Content from '../../../template/components/content/content'
import Row from '../../../template/components/common/row'
import Grid from '../../../template/components/common/grid'

import content from '../../../template/components/content/content';

import {Router, hashHistory,Link} from 'react-router'
import Datatable from '../../../template/components/tables/Datatable'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components'

import LocalizationTypesList from './LocalizationTypesList'

export default class LocalizationTypes extends Component {
    componentWillMount() {
        if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/login";
        }
    }
    render() {
        return ( 
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Cadastros', 'Tipos de Localizaçāo']} icon="fa fa-fw fa-suitcase"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4" />
                </div>

                <JarvisWidget editbutton={false} color="darken" deletebutton={false} colorbutton={false} >
                    <header>
                        <span className="widget-icon"> <i className="fa fa-table" /> </span> 
                        <h2>Cargos</h2>
                    </header>
                    <div>
                        <div className="widget-body no-padding">
                        
                            <Link class="btn btn-success" href="#/localization-types/create"><i class="fa fa-plus-circle"></i> Novo</Link>    
                            <LocalizationTypesList />

                        </div>
                    </div>
                </JarvisWidget>  

            </div>
        )
    }
}
