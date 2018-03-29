import React, { Component } from 'react';
import { Card, CardHeader, CardFooter, CardBody} from 'reactstrap';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import axios from '../../common/axios';

class SchoolList extends Component {

    constructor(props) {
        super(props);

        //console.log(props);

        this.state = {
            page: 1,
            data: [],
            pages: null,
            sizePerPage: 10,
            totalSize: 0,
            lastFilter : '',
            lastOrder : '',
            loading: true,
            columns: [
                { Header: 'ID', acessor: 'id' },
                { Header: 'Tipo', acessor: 'school_type.name'},
                { Header: 'Filial', acessor: 'state_id'},
                { Header: 'TOTVS', acessor: 'school_code_totvs'},
                { Header: 'Perfil', acessor: 'profile.name'},
                { Header: 'Nome', acessor: 'name'},
                { Header: 'Endereço', acessor: 'address'},
                { Header: 'Bairro', acessor: 'neighborhood'},
                { Header: 'Cidade', acessor: 'city'},
                { Header: 'UF', acessor: 'state.abbrev'}
            ]
        };
    }

    // componentDidMount() {
    //     axios.get(`/school?page=1`)
    //         .then(response => {
    //             const dados = response.data.data

    //             console.log(dados);

    //             this.setState(() => ({
    //                 page: 1,
    //                 data: dados,
    //                 sizePerPage: 10,
    //                 totalSize: response.data.meta.pagination.total,
    //                 pages: response.data.meta.pagination.last_page,
    //                 loading: false
    //             }))
    //         })
    //         .catch(err => console.log(err));
    // }

    onFetchData = (type, { page, sizePerPage, filters, sortField, sortOrder, data }) => {
        let baseURL = `/school?paginate=10&page=1`

        // let urlSort = sortField ? `&order[${sortField}]=${sortOrder}` : ''

        // let filterId = Object.keys(filters).toString()
        // let arrFilterId = filterId.split(',')
        // let urlFilter = '' 

        // if(filterId){
        //     arrFilterId.map(function(item){
        //         urlFilter += `&filter[${item}]=${filters[`${item}`]['filterVal']}`
        //     })
        // }        

        // switch(type){
        //     case 'filter':
        //         baseURL += `${urlFilter}${this.state.lastOrder}`
        //         break
        //     case 'sort':
        //         baseURL += `${this.state.lastFilter}${urlSort}`
        //         break
        //     default:
        //         baseURL += `${this.state.lastFilter}${this.state.lastOrder}`
        // }

        axios.get(baseURL)
            .then(response => {
                const dados = response.data.data

                this.setState(() => ({
                    page: 1,
                    data: dados,
                    sizePerPage: 10,
                    totalSize: response.data.meta.pagination.total,
                    pages: response.data.meta.pagination.last_page,
                    loading: false
                    // lastFilter : urlFilter,
                    // lastOrder : urlSort
                }))
            })
            .catch(err => console.log(err));
    }  

    render() {
        // const data = [{
        //     name: 'Tanner Linsley',
        //     age: 26,
        //     friend: {
        //       name: 'Jason Maurer',
        //       age: 23,
        //     }
        //   }]
        
        //   const columns = [{
        //     Header: 'Name',
        //     accessor: 'name' // String-based value accessors!
        //   }, {
        //     Header: 'Age',
        //     accessor: 'age',
        //     Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        //   }, {
        //     id: 'friendName', // Required because our accessor is not a string
        //     Header: 'Friend Name',
        //     accessor: d => d.friend.name // Custom value accessors!
        //   }, {
        //     Header: props => <span>Friend Age</span>, // Custom header components!
        //     accessor: 'friend.age'
        //   }]
        
        const { data, sizePerPage, page, totalSize, loading, columns, pages } = this.state;
          
        return (



            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Escolas
                </CardHeader>
                <CardBody>                            
                <ReactTable
                    data={data}
                    columns={columns}
                    pages={pages}
                    loading={loading}
                    defaultPageSize={sizePerPage}
                    onFetchData={this.onFetchData}
                    manual
                    previousText='Anterior'
                    nextText='Próximo'
                    loadingText='Carregando...'
                    noDataText='Sem registros'
                    pageText='Página'
                    ofText='de'
                    rowsText='registros'
                />
                </CardBody>
            </Card>
        )
    }
}

export default SchoolList;