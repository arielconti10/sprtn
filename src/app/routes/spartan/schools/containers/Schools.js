import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../../components/content/contentHeader'
import Content from '../../../../components/content/content'
import Row from '../../../../components/common/row'
import Grid from '../../../../components/common/grid'

import SchoolsList from './SchoolsList'
import content from '../../../../components/content/content';

import Datatable from '../../../../components/tables/Datatable'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

export default class Schools extends Component {
    render() {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImMzNjkzYWVjNzFjMWI3NjcwOThiM2FmMGFlYTVhYjEwODA2YzczZjhlY2MwOTQ4ZTViYjNiYzJmNjQxMzFjMTg1YjRkNzc2NDBmODY0Y2ZlIn0.eyJhdWQiOiIyIiwianRpIjoiYzM2OTNhZWM3MWMxYjc2NzA5OGIzYWYwYWVhNWFiMTA4MDZjNzNmOGVjYzA5NDhlNWJiM2JjMmY2NDEzMWMxODViNGQ3NzY0MGY4NjRjZmUiLCJpYXQiOjE1MjE0NTQzOTIsIm5iZiI6MTUyMTQ1NDM5MiwiZXhwIjoxNTIxNTQwNzkyLCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.cgJ8OK4XcwGdnnpR4r6JPGrJyRmISAdqasM8582UccZjruhezVtp-kkSpzmOKt5klMAYkGd1gWxiW3WgStODmF_A8xXKoyE6ytoVl9jlProUAtViKrBC70VDKLnArWMVQT7BSo9eUxiD_3tRIKN6fKDW5yi9AVgARXwA-3RT7YKM56Gny8BMplKjNIKpn-jMaMRSxI84OejXOePY-PKljxSCh6Pq9BkpmM_vrqEyRzaRl-cxgdCWdLnwtEkn9ZrHNzBL2u4MIXynNKKb-oCuGIN_7lwNJCJB-HZHqxbNL9A44KEnrKuHBQTZuthJ5LLfvjc8_ZnCOvSKFyD7N321ntQEtpyWL4wp4qrwLJsTVQwWjyfn7adcg0URnCR6ZWa6YRb3PSz4lg9vFv9a4kDsVS3vak6RXWtUN9q52IRKgAVah1-_vu9oqlbTP9kNPlyn6j004Gf8hO1HHSxemKoGObIBPsPViemRqd7mUnB9wtacviaMI87otbOojvJHWrxcVTA1jQnjwWBBX98aaoupZEUQh8V33Sm1sBbbdkN5zPiyz6j3Faws0x19JBmEEWYBcjXYnM5BFF7aGQ-FMKOWrVWx4dXgWFqGJwRRr2iZ9MF6ytTmSOabDxDa_-Os1IWFQ2Fwdx-FUeuHmM1DUg7XSfWiMQttQVXg2KqP0dcp4K8'

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

                                        <Datatable 
                                            options={{
                                                processing: true,
                                                serverSide: true,
                                                ajax: {
                                                    url: 'http://hapi.spartan.ftd.com.br/api/school?school_type.name=Particular&page=2',
                                                    type: 'GET',
                                                    beforeSend: function (request) {
                                                        request.setRequestHeader("Authorization", `Bearer ${token}`);
                                                    }
                                                },
                                                columns: [
                                                    { data: "school_code_totvs" }, 
                                                    { data: "name" }, 
                                                    { data: "phone" }, 
                                                    { data: "school_id" }, 
                                                    { data: "user_id" },
                                                    { data: "cnpj" }, 
                                                    { data: "zip_code" }, 
                                                    { data: "profile_id" }, 
                                                    { data: "address" }, 
                                                    { data: "city" }
                                                ],                                                
                                                ordering: true,
                                                scrollY: 200,                                              
                                                paging: true
                                            }}
                                            paginationLength={true} 
                                            className="table table-bordered table-hover"
                                            width="100%">
                                            
                                            <thead>
                                                <tr>
                                                    <th>Cód.</th>
                                                    <th>Nome</th>
                                                    <th>1º</th>
                                                    <th>2º</th>
                                                    <th>3º</th>
                                                    <th>4</th>
                                                    <th>5º</th>
                                                    <th>Total</th>
                                                    <th>Endereço</th>
                                                    <th>Cidade - UF</th>
                                                </tr>
                                            </thead>

                                        </Datatable>

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
