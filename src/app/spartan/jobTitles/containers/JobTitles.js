import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../template/components/content/contentHeader'
import Content from '../../../template/components/content/content'
import Row from '../../../template/components/common/row'
import Grid from '../../../template/components/common/grid'

import content from '../../../template/components/content/content';

import Datatable from '../../../template/components/tables/Datatable'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components'

import JobTitlesList from './JobTitlesList'

export default class JobTitles extends Component {
    componentWillMount() {
        if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/spartan/login";
        }
    }
    render() {
        return ( 
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Cadastros', 'Cargos']} icon="fa fa-fw fa-suitcase"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4" />
                </div>

                <WidgetGrid>

                    <div className="row">
                        <article className="col-sm-12">

                            <JarvisWidget editbutton={false} color="darken" deletebutton={false} colorbutton={false} >
                                <header>
                                    <span className="widget-icon"> <i className="fa fa-table" /> </span> 
                                    <h2>Escolas</h2>
                                </header>
                                <div>
                                    <div className="widget-body no-padding">
                                    
                                        
                                        <JobTitlesList />

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
