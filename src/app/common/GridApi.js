import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import './GridApi.css'
import axios from '../common/axios';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

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
            columns: this.props.columns,
            columnsAlt: this.props.columnsAlt,
            dataAlt: [],
            dataAltSelected: []
        };
    }

    onClickDelete(element) {
        const { id, code, name } = element.value;

        axios.delete(`${this.props.apiSpartan}/${id}`, {
            'code': code ? code.toUpperCase() : '',
            'name': name ? name : '',
            'active': false
        }).then(res => {
            this.onFetchData();
        }).catch(function (error) {
            console.log(error)
        }.bind(this));
    }

    onClickActive(element) {
        const { id, code, name } = element.value;

        const updateData = {};
        for (var val in element.value) {
            //console.log(value);

            if (val != 'created_at' && val != 'updated_at' && val != 'deleted_at') {
                updateData[val] = element.value[val];
            }
        }

        updateData.active = true;

        axios.put(`${this.props.apiSpartan}/${id}`, updateData).then(res => {
            this.onFetchData();
        }).catch(function (error) {
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
            })

        if (this.props.columnsAlt) {

            
                        
            this.props.columnsAlt.map(item => {

                if (item.type == 'select' || item.type == 'selectMulti') {   
                    
                    if (item.api) {
                        axios.get(item.api)
                        .then(response => {
                            const dados = response.data.data;
        
                            //console.log(dados);
        
                            this.setState({ dataAlt: dados});
                            //this.setState({ job_title_type_id: dados[0].id });
                        })
                        .catch(err => console.log(err));
                    }

                    const multi = item.type == 'selectMulti' ? true : false;
                    col.push(
                        {
                            Header: item.Header,
                            accessor: item.accessor,
                            width: item.width,
                            headerClassName: 'text-center',
                            style: {overflow: 'visible'},
                            sortable: false,
                            Cell: (element) => {
                                //console.log(element)

                                const column_value = element.value.map(val => {
                                    return val.id
                                });

                                return (                                   
                            
                                    <div>
                                        <Select
                                        name={item.name}
                                        onChange={(selectedOption) => {
                                            console.log(item.accessor)
                                            const column_value_changed = selectedOption.map(function(cv) {
                                                //console.log(item.name);
                                                return cv.id;
                                            });

                                            this.setState({ dataAltSelected: {
                                                [element.row[""].id]: column_value_changed }
                                            });

                                            const column_value_update = selectedOption.map(function(cv) {
                                                let value = {};
                                                value[item.name] = cv.id;
                                                return value;
                                            }, {});

                                            //console.log(column_value_update);

                                            const updateData = {};

                                            let id = 0;
                                            for (var value in element.row['']) {
                                                //console.log(value);

                                                if (value == 'id') {
                                                    id = element.row[''][value]
                                                }
                                                else if (value != 'created_at' && value != 'updated_at' && value != 'deleted_at' && value != item.accessor) {
                                                    updateData[value] = element.row[''][value];
                                                }
                                                else if (value == item.accessor) {
                                                    updateData[value] = column_value_update;
                                                }
                                            }

                                            updateData.active = true;

                                            axios.put(`${this.props.apiSpartan}/${id}`, updateData).then(res => {
                                                this.onFetchData();
                                            }).catch(function (error) {
                                                console.log(error)
                                            }.bind(this));
                                            //console.log(data_update_role);
                                        }}
                                        labelKey="name"
                                        valueKey="id"
                                        value={this.state.dataAltSelected[element.row[""].id] == undefined ? column_value : this.state.dataAltSelected[element.row[""].id]}
                                        multi={multi}
                                        joinValues={false}
                                        // menuContainerStyle={{'zIndex': 99999}}
                                        //isLoading={this.state.roleSelect2Loading}
                                        placeholder="Selecione um valor"
                                        options={this.state.dataAlt}
                                        rtl={false}
                                    /> </div>
                            )}
                        })
                    }
            })
            
        }
        if (!this.props.hideButtons) {
            col.push(
                {
                    Header: "Ações", accessor: "", sortable: false, width: 100, headerClassName: 'text-center', Cell: (element) => (
                        !element.value.deleted_at ?
                            <div>

                                <Link to={this.props.match.url + "/" + element.value.id} params={{id: element.value.id}} className='btn btn-primary btn-sm' >
                                    <i className='fa fa-pencil'></i>
                                </Link>
                                <button className='btn btn-danger btn-sm' onClick={() => this.onClickDelete(element)}>
                                    <i className='fa fa-ban'></i>
                                </button>
                                {/* <Link to={this.props.match.url + "/" + element.value.id + "/permissoes"} params={{id: element.value.id}} title="Permissões" className='btn btn-warning btn-sm' >
                                    <i className='fa fa-lock'></i>
                                </Link> */}
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
        }
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
        
        this.setState({loading: true});

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