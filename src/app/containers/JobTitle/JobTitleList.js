import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'


import axios from '../../common/axios';


const teste = {abc: 123};

teste.abc = 456;

console.log(teste);

class JobTitleList extends Component {

    constructor(props) {
        super(props);

        //console.log(props);

        this.state = {
            page: 1,
            data: [],
            sizePerPage: 10,
            totalSize: 0,
            lastFilter : '',
            lastOrder : '',
            columns: [
                { text: 'ID', dataField: 'id', sort: true, filter: textFilter() },
                { text: 'Nome', dataField: 'name', sort: true, filter: textFilter() }
            ]
        };
    }

    componentDidMount() {
        axios.get(`/job-title?page=1`)
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

    tableChangeHandler = (type, { page, sizePerPage, filters, sortField, sortOrder, data }) => {
        let baseURL = `/job-title?paginate=${sizePerPage}&page=${page}`

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

        let teste = 2;

        console.log(teste);

        teste = 3;

        console.log(teste);

        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Cargos
                </CardHeader>
                <CardBody>  
                    <p>
                        <NavLink to={this.props.match.url + "/form"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>                        
                    </p>
                    <div>
                    <BootstrapTable
                        remote={{ pagination: true, sort: true }}
                        keyField="id"
                        data={data}
                        columns={columns}
                        filter={filterFactory()}
                        pagination={paginationFactory({ page, sizePerPage, totalSize })}
                        onTableChange={this.tableChangeHandler}
                        bordered={ false }
                    />
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default JobTitleList;