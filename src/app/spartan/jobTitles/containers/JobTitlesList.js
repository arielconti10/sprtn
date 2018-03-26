import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import axios from '../../common/axiosSpartan'

const selectOptions = {
    'Federal': 'Federal',
    'Estadual': 'Estadual',
    'Municipal': 'Municipal',
    'Particular': 'Particular',
    'Particular Católica': 'Particular Católica',
    'Secretaria De Ensino': 'Secretaria De Ensino',
    'Delegacia De Ensino': 'Delegacia De Ensino',
    'Prefeitura': 'Prefeitura',
    'Marista': 'Marista'
};

const apiName = 'school'

export default class JobTitlesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            data: [],
            sizePerPage: 10,
            totalSize: 0,
            lastFilter : '',
            lastOrder : '',
            columns: [
                { text: 'ID', dataField: 'id' },
                { text: 'Tipo', dataField: 'school_type.name', sort: false, filter: selectFilter({ options: selectOptions }) },
                { text: 'Filial', dataField: 'state_id', sort: true, filter: textFilter() },
                { text: 'TOTVS', dataField: 'school_code_totvs', sort: true, filter: textFilter() },
                { text: 'Perfil', dataField: 'profile.name', sort: true },
                { text: 'Nome', dataField: 'name', sort: true, filter: textFilter() },
                { text: 'Endereço', dataField: 'address', sort: true, filter: textFilter() },
                { text: 'Bairro', dataField: 'neighborhood', sort: true, filter: textFilter() },
                { text: 'Cidade', dataField: 'city', sort: true, filter: textFilter() },
                { text: 'UF', dataField: 'state.abbrev', sort: true }
            ]
        };
    }

    componentDidMount() {
        axios.get(`${apiName}?page=1`)
            .then(response => {
                const dados = response.data.data

                this.setState(() => ({
                    page: 1,
                    data: dados,
                    sizePerPage: 10,
                    totalSize: response.data.meta.pagination.total
                }))
            })
            .catch(err => console.log(err));
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, data }) => {
        let baseURL = `${apiName}?paginate=${sizePerPage}&page=${page}`

        let urlSort = sortField ? `&order[${sortField}]=${sortOrder}` : ''

        let filterId = Object.keys(filters).toString()
        let arrFilterId = filterId.split(',')
        let urlFilter = '' 

        if(filterId){
            arrFilterId.map(function(item){
                urlFilter += `&filter[${item}]=${filters[`${item}`]['filterVal']}`
            })
        }        

        switch(type){
            case 'filter':
                baseURL += `${urlFilter}${this.state.lastOrder}`
                break
            case 'sort':
                baseURL += `${this.state.lastFilter}${urlSort}`
                break
            default:
                baseURL += `${this.state.lastFilter}${this.state.lastOrder}`
        }

        axios.get(baseURL)
            .then(response => {
                const dados = response.data.data

                this.setState(() => ({
                    page: page,
                    data: dados,
                    sizePerPage: sizePerPage,
                    totalSize: response.data.meta.pagination.total,
                    lastFilter : urlFilter,
                    lastOrder : urlSort
                }))
            })
            .catch(err => console.log(err));
    }    

    render() {
        const { data, sizePerPage, page, totalSize, columns } = this.state;

        return (
            <div>
                <BootstrapTable
                    remote={{ pagination: true, sort: true }}
                    keyField="id"
                    data={data}
                    columns={columns}
                    filter={filterFactory()}
                    pagination={paginationFactory({ page, sizePerPage, totalSize })}
                    onTableChange={this.handleTableChange}
                />
            </div>
        );
    }
}