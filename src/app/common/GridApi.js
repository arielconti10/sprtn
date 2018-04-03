import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import './GridApi.css'
import axios from '../common/axios';

class GridApi extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 10,
            data: [],
            filtered: [],
            sorted: [],
            pages: null,
            loading: false,
            columns: this.props.columns
        };
    }

    onClickDelete(element) {
        const { id, code, name } = element.value;

        axios.delete(`${this.props.apiSpartan}/${id}`, {
            'code': code.toUpperCase(),
            'name': name,
            'active': false
        }).then(res => {
            this.onFetchData();
        }).catch(function(error) {
            console.log(error)
        }.bind(this));
    }

    onClickActive(element) {
        const { id, code, name } = element.value;

        axios.put(`${this.props.apiSpartan}/${id}`, {
            'code': code.toUpperCase(),
            'name': name,
            'active': true
        }).then(res => {
            this.onFetchData();
        }).catch(function(error) {
            console.log(error)
        }.bind(this));

    }

    componentDidMount() {
        let col = this.state.columns
        col.push(
            {
                Header: "Status",
                accessor: "",
                width: 100,
                headerClassName: 'text-left',
                sortable: false,
                Cell: (element) => (
                    !element.value.deleted_at ?
                    <div><span>Ativo</span></div>
                    :
                    <div><span>Inativo</span></div>
                )/*,                
                filterable: true, 
                Filter: ({ filter, onChange }) => (
                   
                    <select
                        onChange={event => this.onFetchData(null, null, event.target.value, { filter, onChange })}
                        style={{ width: "100%" }}
                    >
                        <option value="all">Todos</option>
                        <option value="false">Ativo</option>
                        <option value="true">Inativo</option>
                    </select>
                )*/
            },
            {
                Header: "Ações", accessor: "", sortable: false, width: 100, headerClassName: 'text-left', Cell: (element) => (
                    !element.value.deleted_at ?
                        <div>

                            <Link to={`${this.props.match.url + "/form/"}${element.value.id}`} className='btn btn-primary btn-sm' >
                                <i className='fa fa-pencil'></i>
                            </Link>
                            <button className='btn btn-danger btn-sm' onClick={() => this.onClickDelete(element)}>
                                <i className='fa fa-ban'></i>
                            </button>
                        </div>
                        :
                        <div>
                            <button className='btn btn-success btn-sm' onClick={() => this.onClickActive(element)}>
                                <i className='fa fa-check-circle'></i>
                            </button>
                        </div>

                )
            }
        )
        this.setState({ columns: col })
    }

    onFetchData = (state, instance, deleted_at) => {
        let apiSpartan = this.props.apiSpartan
        
        let pageSize = state ? state.pageSize : this.state.pageSize;
        let page = state ? state.page + 1 : this.state.page;

        let sorted = state ? state.sorted : this.state.sorted
        let filtered = state ? state.filtered : this.state.filtered

        let baseURL = `/${apiSpartan}?paginate=${pageSize}&page=${page}`;

        //To do: make filter to deleted_at
        /*console.log('onFetchData:', deleted_at);
        if(deleted_at != 'all')
            console.log("deleted_at != 'all'", deleted_at);*/

        filtered.map(function (item) {
            baseURL += `&filter[${item.id}]=${item.value}`;
        })

        for (let i = 0; i < sorted.length; i++) {
            baseURL += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
        }

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data.data

                this.setState({
                    data: dados,
                    totalSize: response.data.meta.pagination.total,
                    pages: response.data.meta.pagination.last_page,
                    page: response.data.meta.pagination.current_page,
                    pageSize: parseInt(response.data.meta.pagination.per_page),
                    sorted: sorted,
                    filtered: filtered,
                    loading: false
                });
            })
            .catch(err => console.log(err));
    }

    render() {

        const { data, pageSize, page, loading, pages, columns } = this.state;

        return (
            <div>
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
                    className='-striped -highlight'
                />
            </div>
        )
    }
}

export default withRouter(GridApi);