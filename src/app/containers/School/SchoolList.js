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
            // pageSize: 10,
            // totalSize: 0,
            // lastFilter : '',
            // lastOrder : '',
            loading: true,
            
        };

        //this.onFetchData = this.onFetchData.bind(this);
    }

    // componentDidMount() {
    //     axios.get(`/school?page=1`)
    //         .then(response => {
    //             const dados = response.data.data

    //             console.log(dados);

    //             this.setState(() => ({
    //                 page: 1,
    //                 data: dados,
    //                 pageSize: 10,
    //                 totalSize: response.data.meta.pagination.total,
    //                 pages: response.data.meta.pagination.last_page,
    //                 loading: false
    //             }))
    //         })
    //         .catch(err => console.log(err));
    // }

    // onFetchData = (state, { page, pageSize, filters, sortField, sortOrder, data, pages }) => {
    // //onFetchData = (state, instance) => {

    //     console.log(state);
    //     let baseURL = `/school?paginate=${state.pageSize}&page=${state.page+1}`

    //     // let urlSort = sortField ? `&order[${sortField}]=${sortOrder}` : ''

    //     // let filterId = Object.keys(filters).toString()
    //     // let arrFilterId = filterId.split(',')
    //     // let urlFilter = '' 

    //     // if(filterId){
    //     //     arrFilterId.map(function(item){
    //     //         urlFilter += `&filter[${item}]=${filters[`${item}`]['filterVal']}`
    //     //     })
    //     // }        

    //     // switch(type){
    //     //     case 'filter':
    //     //         baseURL += `${urlFilter}${this.state.lastOrder}`
    //     //         break
    //     //     case 'sort':
    //     //         baseURL += `${this.state.lastFilter}${urlSort}`
    //     //         break
    //     //     default:
    //     //         baseURL += `${this.state.lastFilter}${this.state.lastOrder}`
    //     // }

    //     axios.get(baseURL)
    //         .then((response) => {
    //             const dados = response.data.data

    //             this.setState({
    //                 //page: state.page+1,
    //                 data: dados,
    //                 //pageSize: state.pageSize,
    //                 totalSize: response.data.meta.pagination.total,
    //                 pages: response.data.meta.pagination.last_page,
    //                 loading: false
    //                 // lastFilter : urlFilter,
    //                 // lastOrder : urlSort
    //             });

    //             console.log(this.state);
    //         })
    //         .catch(err => console.log(err));
    // }  

    render() {
        
        const { data, pageSize, page, loading, pages } = this.state;

        const columns= [
            { Header: 'ID', acessor: 'id' },
            { Header: 'Tipo', acessor: 'name'},
            { Header: 'Filial', acessor: 'state_id'},
            { Header: 'TOTVS', acessor: 'school_code_totvs'},
            { Header: 'Perfil', acessor: 'name'},
            { Header: 'Nome', acessor: 'name'},
            { Header: 'Endereço', acessor: 'address'},
            { Header: 'Bairro', acessor: 'neighborhood'},
            { Header: 'Cidade', acessor: 'city'},
            { Header: 'UF', acessor: 'name'}
        ]
          
        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Escolas
                </CardHeader>
                <CardBody>                            
                <ReactTable                    
                    columns={columns}
                    data={data}
                    pages={pages}
                    loading={loading}
                    defaultPageSize={pageSize}
                    manual
                    // onFetchData={this.onFetchData}
                    onFetchData={(state, instance) => {
                        let baseURL = `/school?paginate=${state.pageSize}&page=${state.page+1}`

                        // show the loading overlay
                        this.setState({loading: true})
                        // fetch your data
                        axios.get(baseURL)
                            .then((response) => {
                                const dados = response.data.data

                                this.setState({
                                    //page: state.page+1,
                                    data: dados,
                                    //pageSize: state.pageSize,
                                    //totalSize: response.data.meta.pagination.total,
                                    pages: response.data.meta.pagination.last_page,
                                    loading: false
                                    // lastFilter : urlFilter,
                                    // lastOrder : urlSort
                                });

                                console.log(this.state);
                            })
                            .catch(err => console.log(err));
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
        )
    }
}

export default SchoolList;