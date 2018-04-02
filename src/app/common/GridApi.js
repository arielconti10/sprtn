import React, { Component } from 'react';
import { Card, CardHeader, CardFooter, CardBody } from 'reactstrap';
import { Router, hashHistory, Link, browserHistory } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import axios from '../common/axios';

class GridApi extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            data: [],
            pages: null,
            loading: false,
            columns: this.props.columns
        };

    }

    onClickDelete(element) {
        console.log(element.value)
        const { id, code, name } = element.value;

        axios.delete(`${this.props.apiSpartan}/${id}`, {
            'code': code.toUpperCase(),
            'name': name,
            'active': false
        }).then(res => {
            //window.location.href = "#/cadastro/cargos";
            this.onFetchData();
        }).catch(function(error) {
            console.log(error)
            /*let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({ back_error: data_error[filterId] });*/
        }.bind(this));
    }

    onClickActive(element) {
        console.log(element.value)
        const { id, code, name } = element.value;

        axios.put(`${this.props.apiSpartan}/${id}`, {
            'code': code.toUpperCase(),
            'name': name,
            'active': true
        }).then(res => {
            //window.location.href = "#/cadastro/cargos";
            this.onFetchData();
        }).catch(function(error) {
            console.log(error)
            /*let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({ back_error: data_error[filterId] });*/
        }.bind(this));

    }

    componentDidMount() {
        let col = this.state.columns
        col.push(
            {
                Header: "Ativo", accessor: "", sortable: false, Cell: (element) => (
                    !element.value.deleted_at ?
                        <div><span>Ativo</span></div>
                        :
                        <div><span>Inativo</span></div>

                )
            },
            {
                Header: "Ações", accessor: "", sortable: false, Cell: (element) => (
                    !element.value.deleted_at ?
                        <div>

                            <Link to={`/sectors/update/${element.value.id}`} className='btn btn-warning' >
                                <i className='fa fa-pencil'></i>
                            </Link>
                            <button className='btn btn-danger' data-toggle="modal"
                                data-target="#myModal"
                                onClick={() => this.onClickDelete(element)}>
                                <i className='fa fa-ban'></i>
                            </button>
                        </div>
                        :
                        <div>
                            <button className='btn btn-success' data-toggle="modal"
                                data-target="#myModal"
                                onClick={() => this.onClickActive(element)}>
                                <i className='fa fa-check-circle'></i>
                            </button>
                        </div>

                )
            }
        )
        this.setState({ columns: col })
    }

    onFetchData = (state, instance) => {
        let apiSpartan = this.props.apiSpartan
        let pageSize = state ? state.pageSize : 20;
        let page = state ? state.page + 1 : 1

        let baseURL = `/${apiSpartan}?paginate=${pageSize}&page=${page}`;

        if (state) {
            for (let i = 0; i < state.sorted.length; i++) {
                console.log(state.sorted[i]);
                baseURL += "&order[" + state.sorted[i]['id'] + "]=" + (state.sorted[i]['desc'] == false ? 'asc' : 'desc');
            }
        }

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data.data

                this.setState({
                    data: dados,
                    totalSize: response.data.meta.pagination.total,
                    pages: response.data.meta.pagination.last_page,
                    loading: false
                });
            })
            .catch(err => console.log(err));
    }

    render() {

        const { data, pageSize, page, loading, pages, columns } = this.state;

        return (
            <div>
                <Card>
                    <CardHeader>
                        <i className="fa fa-table"></i>{this.props.cardHeader}
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            columns={columns}
                            data={data}
                            pages={pages}
                            loading={loading}
                            defaultPageSize={pageSize}
                            manual
                            onFetchData={this.onFetchData}
                            /*SubComponent={(row, column) => {
                                return (
        
                                    <div style={{ padding: "20px" }}>
                                        Endereço:
                                </div>
                                );
                            }}*/
                            onExpandedChange={(expanded, index, event) => {
                                event.persist();
                            }}
                            previousText='Anterior'
                            nextText='Próximo'
                            loadingText='Carregando...'
                            noDataText='Sem registros'
                            pageText='Página'
                            ofText='de'
                            rowsText=''
                        />
                    </CardBody>
                </Card>

            </div>
        )
    }
}

export default GridApi;