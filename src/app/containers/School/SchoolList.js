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
            pageSize: 10,
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
    //             const dados = response.data.data;

                

    //             console.log(dados);

    //             this.setState({
    //                 data: dados
    //             });

    //             // this.setState(() => ({
    //             //     page: 1,
    //             //     data: dados,
    //             //     pageSize: 10,
    //             //     totalSize: response.data.meta.pagination.total,
    //             //     pages: response.data.meta.pagination.last_page,
    //             //     loading: false
    //             // }))
    //         })
    //         .catch(err => console.log(err));
    // }

    onFetchData = (state, { page, pageSize, filters, sortField, sortOrder, data, pages }) => {
    //onFetchData = (state, instance) => {

        //console.log(state.sorted.length);
        let baseURL = `/school?paginate=${state.pageSize}&page=${state.page+1}`;

        for (let i=0; i < state.sorted.length; i++) {
            console.log(state.sorted[i]);
            baseURL += "&order[" + state.sorted[i]['id'] + "]=" + (state.sorted[i]['desc'] == false ? 'asc' : 'desc');
        }

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

        this.setState({
            loading: true
        });

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data.data

                this.setState({
                    //page: state.page+1,
                    data: dados,
                    //pageSize: state.pageSize,
                    totalSize: response.data.meta.pagination.total,
                    pages: response.data.meta.pagination.last_page,
                    loading: false
                    // lastFilter : urlFilter,
                    // lastOrder : urlSort
                });

                //console.log(this.state);
            })
            .catch(err => console.log(err));
    }  

    render() {
        // console.log(this.state.data);
        const { data, pageSize, page, loading, pages } = this.state;

        const columns = [
            { Header: 'ID', accessor: 'id' },
            { Header: "Nome", accessor: "name"},
            { Header: "Tipo", accessor: "school_type.name", sortable: false},
            { Header: 'Filial', accessor: 'subsidiary.name', sortable: false},
            { Header: 'TOTVS', accessor: 'school_code_totvs', sortable: false},
            { Header: 'Perfil', accessor: 'profile.name'},
            // { Header: 'Nome', accessor: 'name'},
            // { Header: 'Endereço',accessor: 'address'},
            // { Header: 'Bairro', accessor: 'neighborhood'},
            // { Header: 'Cidade', accessor: 'city'},
            // { Header: 'UF', accessor: 'name'}
        ];            
          
          
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
                    onFetchData={this.onFetchData}
                    SubComponent={(row, column) => {
                        //console.log(row, column);
                        //console.log(row);
                        return (
                            
                            <div style={{ padding: "20px" }}>
                                Endereço: 
                            </div>
                        );
                    }}
                    onExpandedChange={(expanded, index, event) => {
                        event.persist();
                        //console.log('Inside of onExpandedChange...')
                        //console.log(expanded, index, event)
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