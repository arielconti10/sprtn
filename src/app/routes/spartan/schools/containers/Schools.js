import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../../components/content/contentHeader'
import Content from '../../../../components/content/content'
import Row from '../../../../components/common/row'
import Grid from '../../../../components/common/grid'

import SchoolsParams from './SchoolsParams'
import content from '../../../../components/content/content';

import Datatable from '../../../../components/tables/Datatable'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

import SchoolsList from './SchoolsList2'

export default class Schools extends Component {
    componentWillMount() {
        if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/spartan/login";
        }
    }
    render() {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjkzNjI2N2NlN2JlNGEwZDVmNTRlYWI3ODJkN2QzM2QzMGQxYTg5ZGQxZmY0MDhjOTg1NDM1NTFmMDkxNTVhYjBlNmEyZGQ1MTYyY2JkNGYwIn0.eyJhdWQiOiIyIiwianRpIjoiOTM2MjY3Y2U3YmU0YTBkNWY1NGVhYjc4MmQ3ZDMzZDMwZDFhODlkZDFmZjQwOGM5ODU0MzU1MWYwOTE1NWFiMGU2YTJkZDUxNjJjYmQ0ZjAiLCJpYXQiOjE1MjE1NTM2MTcsIm5iZiI6MTUyMTU1MzYxNywiZXhwIjoxNTIxNjQwMDE3LCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.J669MA_LoMfsYlZOE57s42fanOgZ7giHxh08BjVFsmCPrKBX8RzTSDaisQS3GQCsbfjBo22N8vB_RCrkvnDNfDOzscfMgPIGmSPBQXQtiakDBruJK0E1XMFC9US5XXjk28T2nGR5p677KYQNlxmQfjITeSdDiXmMt6PnSHgDo31YAEJ4fiTy3RmsXcj0OF8ETvfheA-jxiIqkFcldJQ9FJ4R6WQoBCuh531YmJAPj6izo_mSzo0xzvI-Mg5S-4pIHs47TkAg4dcsEoijPno0TPZA8_TizB33Pmk6Wa0AwgdSQ3UbBL_AtZOlRKYQ1hUBT48pxWmQtFxyiHs1kF9xOw-fnHPo84MsMKBITQyUB1ikjm-yEPz5Mv11KzgqMbOSVXaFyIMYYTgneC_dMgBQVv5dFtbnA6KxHlQzObb9hSsICpCcBbx-q1O5agIcIkASxSoV1ARpj45vXsq7MnldPOPQn0oIVwMNifdKhUSGUleAoNc2T9mSutpcFEuoZhj88pRVBaxFQ_exRkmVw56xM8AE09B_Dj4GkW2sHgQ2DGd5VnzzpjDRJJrzM3t6Vz61KHo2frzSCW3pqTvQx-0DlRzF0YXeWkZKM3zuwn66fo_GTvzZCg6pbshw7JagzB1Fr17lCS3_usNp1lLs_s_EccSgUBteENC1-xA_xK75pX4'

        return ( 
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Carteira', 'Escolas']} icon="fa fa-fw fa-suitcase"
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
                                        <SchoolsParams />

                                        <SchoolsList />

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
