import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import { getSchoolsList } from './SchoolsActions'

class SchoolsList extends Component {
    constructor(props) {
        super(props);
        console.log('################## props', props)
        this.state = {
            page: props.page,
            data: props.list,
            sizePerPage: 10,
            pages: [],
            totalSize: props.totalSize
        }
    }

    componentWillMount() {
        this.props.getSchoolsList(1)
    }

    options = {
        paginationSize: 4,
        pageStartIndex: 1,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'Primeira',
        prePageText: 'Voltar',
        nextPageText: 'Próxima',
        lastPageText: 'Ultima',
        nextPageTitle: 'Primeira página',
        prePageTitle: 'Página anterior',
        firstPageTitle: 'Próxima página',
        lastPageTitle: 'Ultima página',
        totalSize: this.props.totalSize,
        onPageChange: (page, sizePerPage) => {
            console.log('this.state', this.state)

            if (this.state.pages.indexOf(page) == -1) {

                this.props.getSchoolsList(page)

                const dados = this.state.data
                const list = this.props.list

                const pages = this.state.pages
                pages.push(page)

                list.map(item => (
                    dados.push(item)
                ))

                this.setState(() => ({
                    page,
                    data: dados,
                    pages
                }))

                console.log('this.state:', this.state)
            }
        }
    }

    render() {

        console.log('************* this.state', this.state)
        const columns = [
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



        const selectRow = {
            mode: 'checkbox',
            onSelect: (row, isSelect, rowIndex) => {
                console.log('selectRow - row:', row)
                console.log('selectRow - isSelect:', isSelect)
                console.log('selectRow - rowIndex:', rowIndex)
            }
        }

        console.log('options', this.options)

        return (
            <div>
                <BootstrapTable keyField='school_code_totvs'
                    data={this.state.data}
                    columns={columns}
                    selectRow={selectRow}
                    pagination={paginationFactory(this.options)} />
            </div>
        )
    }
}

const mapStateToProps = state => ({ list: state.schoolsList.list, page: state.schoolsList.page, totalSize: state.schoolsList.totalSize })
const mapDispatchToProps = dispatch => bindActionCreators({ getSchoolsList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SchoolsList)