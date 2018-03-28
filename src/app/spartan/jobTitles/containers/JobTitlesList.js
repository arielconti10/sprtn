import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';

import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import {Router, hashHistory,Link, browserHistory} from 'react-router'
import { Route , withRouter} from 'react-router-dom';

import axios from '../../common/axiosSpartan'

const apiName = 'job-title'

export default class JobTitlesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            data: [],
            sizePerPage: 10,
            totalSize: 0,
            lastFilter: '',
            lastOrder: '',
            row: '',
            columns: [
                { text: 'ID', dataField: 'id' },
                { text: 'Nome', dataField: 'name', sort: true, filter: textFilter() },
                { text: 'Tipo', dataField: 'job_title_type.name' },
                { text: '', dataField: 'button', formatter: this.cellButton.bind(this) }
            ]
        }
        this.refreshList = this.refreshList.bind(this)
    }

    notify = () => {
            toast("Default Notification !")
    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <div>
                {/*onClick={() => this.onClickJobTitleEdit(cell, row, rowIndex)}*/}
                <Link to = {`/job-titles/update/${row.id}`} className='btn btn-warning' >
                    <i className='fa fa-pencil'></i>
                </Link>
                <button className='btn btn-danger' data-toggle="modal"
                    data-target="#myModal">
                    <i className='fa fa-trash-o'></i>
                </button>
            </div>
        )
    }


    onClickJobTitleEdit(cell, row, rowIndex) {
        browserHistory.push('/#/job-titles/update');
        // browserHistory.refresh();
        console.log(row.id);
        console.log('Edit', cell, row, rowIndex)

    }

    onClickJobTitleDelete() {

        console.log('Delete', this.state.row)
        let values = this.state.row
        axios.delete(`${apiName}/${values.id}`, values)
            .then(resp => {
                this.notify
                this.refreshList()
            })
            .catch(e => {
                e.response.data.errors.forEach(element => this.notify(element))
            })
    }

    refreshList() {
        axios.get(`${apiName}?paginate=10&page=1`)
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

        console.log('after-refresList()')
    }

    componentDidMount() {
        this.refreshList()
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, data }) => {

        let baseURL = `${apiName}?paginate=${sizePerPage}&page=${page}`

        let urlSort = sortField ? `&order[${sortField}]=${sortOrder}` : ''

        let filterId = Object.keys(filters).toString()
        let arrFilterId = filterId.split(',')
        let urlFilter = ''

        if (filterId) {
            arrFilterId.map(function (item) {
                urlFilter += `&filter[${item}]=${filters[`${item}`]['filterVal']}`
            })
        }

        switch (type) {
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
                    lastFilter: urlFilter,
                    lastOrder: urlSort
                }))
            })
            .catch(err => console.log(err));
    }

    render() {
        const { data, sizePerPage, page, totalSize, columns } = this.state;

        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            hideSelectColumn: true,
            bgColor: '#eee'
        }

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                console.log('onClick', e, row, rowIndex)
                this.setState({ row })
            }
        }

        return (
            <div>
                <BootstrapTable
                    remote={{ pagination: true, sort: true, cellEdit: true }}
                    keyField="id"
                    data={data}
                    columns={columns}
                    selectRow={selectRow}
                    rowEvents={rowEvents}
                    filter={filterFactory()}
                    pagination={paginationFactory({ page, sizePerPage, totalSize })}
                    onTableChange={this.handleTableChange}
                />

                <button onClick={this.notify}>Notify</button>

                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                    &times;
                                </button>
                                <h4 className="modal-title" id="myModalLabel">Excluir registro</h4>
                            </div>
                            <div className="modal-body">

                                <div className="row">
                                    <p>Deseja realmente excluir este registro?</p>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary"
                                    onClick={() => this.onClickJobTitleDelete()}
                                    data-dismiss="modal">
                                    Sim
                                </button>
                            </div>
                        </div>
                        {/* /.modal-content */}
                    </div>
                    {/* /.modal-dialog */}
                </div>
                {/* /.modal */}

            </div>
        );
    }
}