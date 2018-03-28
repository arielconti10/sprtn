import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Router, hashHistory,Link } from 'react-router'
import { BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components'

import SubsidiariesList from './SubsidiariesList'

export default class Subsidiaries extends Component {
    componentWillMount() {
        if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/login";
        }
    }
    render() {
        return ( 
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Cadastros', 'Filiais']} icon="fa fa-fw fa-suitcase"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4" />
                </div>

                <WidgetGrid>

                    <div className="row">
                        <article className="col-sm-12">

                            <JarvisWidget editbutton={false} color="darken" deletebutton={false} colorbutton={false} >
                                <header>
                                    <span className="widget-icon"> <i className="fa fa-table" /> </span> 
                                    <h2>Filiais</h2>
                                </header>
                                <div>
                                    <div className="widget-body no-padding">
                                    
                                        <Link class="btn btn-success" href="#/subsidiaries/create"><i class="fa fa-plus-circle"></i> Novo</Link>    
                                        <SubsidiariesList />

                                    </div>
                                </div>
                            </JarvisWidget>  

                        </article>
                    </div>

                </WidgetGrid>

            </div>
        )
    }
}
