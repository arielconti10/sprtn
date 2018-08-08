import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import './GridApi.css'

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from './ToggleTable'; 
import { loadColumnsFlow, onFetchDataFlow, onDeleteDataFlow, onActiveDataFlow, toggleDropdownFlow, 
    selectColumnsFlow, selectAllFlow
} from '../../actions/gridApi';

class GridApi extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadColumnsFlow: PropTypes.func,
        onFetchDataFlow: PropTypes.func,
        onDeleteDataFlow: PropTypes.func,
        onActiveDataFlow: PropTypes.func,
        toggleDropdownFlow: PropTypes.func,
        selectColumns: PropTypes.func,
        selectAllFlow: PropTypes.func, 
        gridApi: PropTypes.shape({
            columnsGrid: PropTypes.array,
            data: PropTypes.array,
            page: PropTypes.integer,
            pages: PropTypes.integer,
            pageSize: PropTypes.integer,
            totalSize: PropTypes.integer,
            dropdownOpen: PropTypes.bool,
            loading: PropTypes.bool
        }),
    }

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }

    componentWillMount() {
        const columns = this.props.columns;
        const hideButtons = this.props.hideButtons;
        const urlLink = this.props.urlLink;
        const apiSpartan = this.props.apiSpartan;

        this.props.loadColumnsFlow(columns, hideButtons, urlLink, apiSpartan);
    }

    toggle() {
        const gridApi = this.props.gridApi;
        const status = gridApi.dropdownOpen;
        this.props.toggleDropdownFlow(status);
    }

    handleChange(e) {
        const target = e.currentTarget;
        const gridApi = this.props.gridApi;
        const columns = gridApi.columsInitial;
        const apiSpartan = this.props.apiSpartan;

        this.props.selectColumnsFlow(target, columns, apiSpartan);
    }

    handleSelectAll(event) {
        event.preventDefault();
        const gridApi = this.props.gridApi;
        const selectAll = gridApi.selectAll;
        const columsInitial = gridApi.columsInitial;
        
        this.props.selectAllFlow(selectAll, columsInitial);
    }

    render() {
        const { columnsGrid, data, pages ,pageSize, dropdownOpen, columnsSelected, selectAll, loading } = this.props.gridApi;
        const { apiSpartan, defaultOrder } = this.props;

        return (

            <div>
                <div className="section-dropdown">
                    <ButtonDropdown isOpen={dropdownOpen} 
                        toggle={this.toggle} 
                        className="dropdown-column"
                    >
                        <DropdownToggle caret color="primary">
                            Colunas
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" 
                                            value="all" onChange={this.handleSelectAll}
                                            checked={selectAll?"checked":""} 
                                        />{' '}
                                        <strong>Alternar Seleçāo</strong>
                                    </Label>
                                </FormGroup>
                            </DropdownItem>

                            {columnsSelected.map((item, key) => 
                                (item.accessor == "")?"": 
                                <DropdownItem disabled key={item.accessor}>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" 
                                                value={item.accessor} onChange={this.handleChange}
                                                checked={item.is_checked?"checked":""} 
                                            />{' '}
                                            {item.Header}
                                        </Label>
                                    </FormGroup>
                                </DropdownItem>
                        
                            )}
                        </DropdownMenu>
                    </ButtonDropdown>
                </div> 
                <br />
                <ReactTable
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            // fa fa-check-circle
                            onClick: e => {
                                if (!rowInfo.original.deleted_at && (e.target.className === "fa fa-ban" || e.target.tagName === "BUTTON")) {
                                    this.props.onDeleteDataFlow(apiSpartan, rowInfo, state);
                                }

                                if (rowInfo.original.deleted_at && (e.target.className === "fa fa-check-circle" || e.target.tagName === "BUTTON")) {
                                    this.props.onActiveDataFlow(apiSpartan, rowInfo, state);
                                }
                            }
                        }
                    }}
                    columns={columnsGrid}
                    data={data}
                    pages={pages}
                    defaultPageSize={pageSize}
                    loading={loading}
                    manual
                    onFetchData={this.props.onFetchDataFlow}
                    data_api={apiSpartan}
                    defaultOrder={defaultOrder}
                    onExpandedChange={(expanded, index, event) => {
                        event.persist();
                    }}
                    // defaultSorted={sortInitial}
                    previousText='Anterior'
                    nextText='Próximo'
                    loadingText='Carregando...'
                    noDataText='Sem registros'
                    pageText='Página'
                    ofText='de'
                    rowsText=''
                    className='-striped -highlight'
                />
            </div>
        )
    }
}

const mapStateToProps =(state) => ({
    gridApi : state.gridApi
});

const functions_object = {
    loadColumnsFlow,
    onFetchDataFlow, 
    onDeleteDataFlow,
    onActiveDataFlow,
    toggleDropdownFlow,
    selectColumnsFlow,
    selectAllFlow
}

export default connect(mapStateToProps, functions_object )(GridApi);