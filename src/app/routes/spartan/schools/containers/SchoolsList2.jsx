import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import { getSchoolsList } from './SchoolsActions'

class SchoolsList extends Component {
    componentWillMount() {
        this.props.getSchoolsList()
    }

    render() {
        const list = this.props.list || []

        console.log(list)

        const columns = [
            { text: 'Filial', dataField: "state_id", sort: true },
            { text: 'TOTVS', dataField: "school_code_totvs", sort: true },
            { text: 'Perfil', dataField: "profile.name", sort: true },
            { text: 'Tipo', dataField: "school_type.name", sort: true },
            { text: 'Nome', dataField: "name", sort: true },
            { text: 'Endereço', dataField: "address", sort: true },
            { text: 'Bairro', dataField: "neighborhood", sort: true },
            { text: 'Cidade', dataField: "city", sort: true },
            { text: 'Estado', dataField: "state.abbrev", sort: true },
            { text: 'CEP', dataField: "zip_code", sort: true }
        ]

        const options = {
            onSizePerPageChange: (sizePerPage, page) => {
                console.log('Size per page change!!!');
                console.log('Newest size per page:' + sizePerPage);
                console.log('Newest page:' + page);
            },
            onPageChange: (page, sizePerPage) => {
                console.log('Page change!!!');
                console.log('Newest size per page:' + sizePerPage);
                console.log('Newest page:' + page);
            }
        }

        const selectRow = {
            mode: 'checkbox',
            onSelect: (row, isSelect, rowIndex) => {
                console.log('selectRow - row:', row)
                console.log('selectRow - isSelect:', isSelect)
                console.log('selectRow - rowIndex:', rowIndex)
            }
        }

        return (
            <div>
                <BootstrapTable keyField='school_code_totvs'
                                data={list} 
                                columns={columns} 
                                selectRow={selectRow}
                                pagination={ paginationFactory(options) } />
            </div>
        )
    }
}

const mapStateToProps = state => ({ list: state.schoolsList.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getSchoolsList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SchoolsList)