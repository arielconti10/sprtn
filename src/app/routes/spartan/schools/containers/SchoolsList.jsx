import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactTable from 'react-table'

import Datatable from '../../../../components/tables/Datatable'

import { getSchoolsList } from './SchoolsActions'

class SchoolsList extends Component {
    componentWillMount() {
        this.props.getSchoolsList()
    }

    renderRows() {
        const list = this.props.list || []
        const sum = (t, v) => t + v

        console.log(list[0])
        return list.map(element => (
            <tr key={element.id}>
                <td>{element.school_code_totvs}</td>
                <td>{element.name}</td>
                <td>{element.students.fisrt_grade || 0}</td>
                <td>{element.students.second_grade || 0}</td>
                <td>{element.students.third_grade || 0}</td>
                <td>{element.students.forth_grade || 0}</td>
                <td>{element.students.fifth_grade || 0}</td>
                <td>{`total`}</td>
                <td>{`${element.address} - ${element.neighborhood}`}</td>
                <td>{`${element.city} - ${element.state.abbrev}`}</td>
            </tr>
        ))
    }

    render() {
        const list = this.props.list || []
        
        console.log(list)

        const columns = [{
            Header: 'Cód.',
            accessor: 'school_code_totvs' // String-based value accessors!
        }, {
            Header: 'Nome',
            accessor: 'name'
        }, {
            id: 'students1', // Required because our accessor is not a string
            Header: '1º',
            accessor: d => d.students.fisrt_grade ? d.students.fisrt_grade : 0 // Custom value accessors!
        }, {
            id: 'students2', // Required because our accessor is not a string
            Header: '2º',
            accessor: d => d.students.second_grade ? d.students.second_grade : 0 // Custom value accessors!
        }, {
            id: 'students3', // Required because our accessor is not a string
            Header: '3º',
            accessor: d => d.students.third_grade ? d.students.third_grade : 0 // Custom value accessors!
        }, {
            id: 'students4', // Required because our accessor is not a string
            Header: '4º',
            accessor: d => d.students.forth_grade ? d.students.forth_grade : 0 // Custom value accessors!
        }, {
            id: 'students5', // Required because our accessor is not a string
            Header: '5º',
            accessor: d => d.students.fifth_grade ? d.students.fifth_grade : 0 // Custom value accessors!
        },{
            id: 'total', // Required because our accessor is not a string
            Header: 'Total',
            accessor: d => 'total' // Custom value accessors!
        },{
            id: 'address', // Required because our accessor is not a string
            Header: 'Endereço',
            accessor: d => d.address + ' - ' + d.neighborhood // Custom value accessors!
        },{
            id: 'city', // Required because our accessor is not a string
            Header: 'Cidade - UF',
            accessor: d => d.city + ' - ' + d.state.abbrev  // Custom value accessors!
        }]

        return (
            <div>
                <Datatable />
            </div>
        )
    }
}

const mapStateToProps = state => ({ list: state.schoolsList.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getSchoolsList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SchoolsList)