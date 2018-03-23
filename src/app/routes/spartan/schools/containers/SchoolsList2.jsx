import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import axios from 'axios'

// /import { productsGenerator } from './common';

import { getSchoolsList } from './SchoolsActions'

//const products = productsGenerator(87);

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc2M2MyYmYxOWYyNTIzY2RhOWM2NTJmMTAxOWJiNDJjMWY2ZmQ0MDAwYzBmMTg1ZmZkN2M0ODFkZmEyMzRkZjFhYTRjYjYxN2Y3ZjJjNDEwIn0.eyJhdWQiOiIyIiwianRpIjoiNzYzYzJiZjE5ZjI1MjNjZGE5YzY1MmYxMDE5YmI0MmMxZjZmZDQwMDBjMGYxODVmZmQ3YzQ4MWRmYTIzNGRmMWFhNGNiNjE3ZjdmMmM0MTAiLCJpYXQiOjE1MjE3NTcxNDksIm5iZiI6MTUyMTc1NzE0OSwiZXhwIjoxNTIxODQzNTQ5LCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.UvP2FYlEHja3rvyBGX7Nvo87icjyGFVI00VMk0cgaUkt7-OjgyqW-MWWuxoFPTUj0ZQbK6BONQ92ldXJU4cvCppStEUncxmD5Ws4GhhjnbiaGeOFTVfq3rktM8uiIf6jN_praAxMYInzJT1jeGX2BQ0dwnSzZDUq33YkVR8gGnFKHgywnr4Xn7Oxa30Tt-0WphCwPunSc7NST8KsJPJQKcAL38JpC1R11xMxA3PAiwpK3c_BS3FD7fqzGvoEPycB2wXq2-YpkP1BhOMFRui8i-ASKbMtbnb7pqzHiUK0Youbx1v2xGrUF98skofwAuPPihEqMSA-STKdyv4d5HiunVOnc7vnodv0NFufTivjQfHdXZpGRa1IZ3cBfZNJZniad-dGx-u6PrO5hEG1qyhnrdhNyOMmEeQCB1ldpOOPlz8cPqPEJqOR6NP4xKODWK1iUFVgg3X4RGNFP9Ne50beaL0FwoUMCEONFZG4fshH9QJLISC8DllMn2n0B7x9rdlc8bwFS8xsD1X31ZIL9Dp7JEFSdKpUapLdxO0IpfWWvPKaQu3NRHLqPss12BmmM28P14Q_JZe4nMamcHOFBP_o3LerT3yVb3G7rkWfB4z_XlDRmh4m_gmpQ4C0rRAS7hOFDTzelNT-oyHXn_5jTP_PqZaqckFUfs_eGFU4aPX-f08'

        const URL = 'http://hapi.spartan.ftd.com.br/api/school'

class SchoolsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            data: [],
            sizePerPage: 10,
            totalSize: 0,
            columns: [
                { text: 'ID', dataField: "id", sort: true },
                { text: 'Filial', dataField: "state_id", sort: true },
                { text: 'TOTVS', dataField: "school_code_totvs", sort: true },
                { text: 'Perfil', dataField: "profile.name", sort: true },
                { text: 'Tipo', dataField: "school_type.name", sort: true },
                { text: 'Nome', dataField: "name", sort: true },
                { text: 'Endereço', dataField: "address", sort: true },
                { text: 'Bairro', dataField: "neighborhood", sort: true },
                { text: 'Cidade', dataField: "city", sort: true },
                { text: 'Estado', dataField: "state.abbrev", sort: true }
            ]
          };
      
    }

    componentDidMount() {
        this.props.getSchoolsList(1)

        
        console.log(this.state);
        // axios.get(`${URL}?page=1`, { headers: { Authorization: `Bearer ${token}` }})
        //     .then(response => {
        //         const dados = response.data.data    

        //         this.setState(() => ({
        //             page: 1,
        //             data: dados,
        //             sizePerPage: 10,
        //             totalSize: response.data.meta.pagination.total
        //         }))
        //     })
        //     .catch(err => console.log(err));

    }

    handleTableChange = (type, { page, sizePerPage }) => {
        axios.get(`${URL}?page=${page}&paginate=${sizePerPage}`, { headers: { Authorization: `Bearer ${token}` }})
            .then(response => {
                const dados = response.data.data    
                
                console.log(dados);

                this.setState(() => ({
                    page: page,
                    data: dados,
                    sizePerPage: sizePerPage,
                    totalSize: response.data.meta.pagination.total
                }))
            })
            .catch(err => console.log(err));
        const currentIndex = (page - 1) * sizePerPage;
      }

    render() {
        const { data, sizePerPage, page, totalSize, columns } = this.state;
        return (
            <div>
            <BootstrapTable
                remote
                keyField="id"
                data={ data }
                columns={ columns }
                pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
                onTableChange={ this.handleTableChange }
            />
            </div>
        );
        
    }
}

const mapStateToProps = state => ({ data: state.schoolsList.data, page: state.schoolsList.page, totalSize: state.schoolsList.totalSize, columns: state.schoolsList.columns })
const mapDispatchToProps = dispatch => bindActionCreators({ getSchoolsList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SchoolsList)