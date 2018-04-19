import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter, NavLink } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';
import ReactTable from 'react-table';

import 'react-table/react-table.css'

import axios from '../../common/axios';

class SchoolList extends Component {

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
            columns: []
        };
    }

    componentDidMount() {

        let col = [
            { Header: 'Filial', accessor: 'subsidiary.name', filterable: true, width: 60, headerClassName: 'text-left' },
            { Header: "Nome", accessor: "name", sortable: true, filterable: true, maxWidth: 600, headerClassName: 'text-left' },
            { Header: "CEP", accessor: "zip_code", filterable: true, width: 100, headerClassName: 'text-left' },
            {
                Header: "Identificação", accessor: "school_type", filterable: true, width: 120, headerClassName: 'text-left',
                Cell: props => <span className={`escola-${props.value.identify.toLowerCase()}`}>{props.value.identify}</span>
            },
            { Header: 'Perfil', accessor: 'profile.name', sortable: true, filterable: true, width: 100, headerClassName: 'text-left' }
        ];

        col.push(
            {
                Header: "Status",
                accessor: "",
                width: 60,
                headerClassName: 'text-left',
                sortable: false,
                Cell: (element) => (
                    !element.value.deleted_at ?
                        <div><span className="alert-success grid-record-status">Ativo</span></div>
                        :
                        <div><span className="alert-danger grid-record-status">Inativo</span></div>
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
            }, {
                Header: "Ações", accessor: "", sortable: false, width: 50, headerClassName: 'text-left', Cell: (element) => (
                    <div>
                        <Link to={this.props.match.url + "/" + element.value.id}
                            params={{ id: element.value.id }} className='btn btn-primary btn-sm' >
                            <i className='fa fa-eye'></i>
                        </Link>
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

        let baseURL = `/school?paginate=${pageSize}&page=${page}`;

        //To do: make filter to deleted_at
        /*console.log('onFetchData:', deleted_at);
        if(deleted_at != 'all')
            console.log("deleted_at != 'all'", deleted_at);*/

        filtered.map(function (item) {
            console.log('item', item);
            let id = item.id == 'school_type' ? `${item.id}.identify` : item.id;
            let value = item.value;
            baseURL += `&filter[${id}]=${value}`;
        })

        for (let i = 0; i < sorted.length; i++) {
            baseURL += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
        }

        //this.setState({loading: true});

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
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' disabled={true}><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>
                <ReactTable
                    columns={columns}
                    data={data}
                    pages={pages}
                    loading={loading}
                    defaultPageSize={pageSize}
                    manual
                    onFetchData={this.onFetchData}
                    SubComponent={(row) => {
                        let school = row.original;

                        return (
                            <div style={{ padding: "20px" }}>
                                <b style={{ marginLeft: '20px' }}>Endereço:</b> {school.address}
                                <b style={{ marginLeft: '20px' }}>Bairro:</b> {school.neighborhood}
                                <b style={{ marginLeft: '20px' }}>Cidade:</b> {school.city}
                                <b style={{ marginLeft: '20px' }}>UF:</b> {school.state.abbrev}
                                <b style={{ marginLeft: '20px' }}>CEP:</b> {school.zip_code} <br />
                                <b style={{ marginLeft: '20px' }}>TOTVS:</b> {school.school_code_totvs}
                                <b style={{ marginLeft: '20px' }}>Tipo:</b> {school.school_type.name}
                                {/* To Do: carregar localization_type.name quando a API schools estiver preparada para carregar os registros de localization_type */}
                                <b style={{ marginLeft: '20px' }}>Localização:</b> {school.localization_type_id || ''}                                
                                <b style={{ marginLeft: '20px' }}>Alunos:</b> {school.total_students || 0}
                                <b style={{ marginLeft: '20px' }}>Contatos:</b> {school.contacts.length}    
                                <b style={{ marginLeft: '20px' }}>Telefone:</b> {school.phone}  
                                <b style={{ marginLeft: '20px' }}>E-mail:</b> {school.email}                              
                            </div>
                        );
                    }}
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

export default SchoolList;