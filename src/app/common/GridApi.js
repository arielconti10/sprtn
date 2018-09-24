import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, withRouter, Redirect } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from './axios';
import { generateTermOfAccept } from './GenerateTermOfAccept'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { getSchoolAndVisitValues } from './ToggleTable'; 
import { loadColumnsFlow, onFetchDataFlow, onDeleteDataFlow, onActiveDataFlow, toggleDropdownFlow, 
    selectColumnsFlow, selectAllFlow, loadFilterFlow, selectOptionFlow, setTableInfo,
    toggleDropdownActionsFlow, setLoader, exportTableFlow
} from '../../actions/gridApi';

class GridApi extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadColumnsFlow: PropTypes.func,
        onFetchDataFlow: PropTypes.func,
        onDeleteDataFlow: PropTypes.func,
        onActiveDataFlow: PropTypes.func,
        toggleDropdownFlow: PropTypes.func,
        toggleDropdownActionsFlow: PropTypes.func,
        selectColumns: PropTypes.func,
        selectAllFlow: PropTypes.func, 
        loadFilterFlow: PropTypes.func,
        selectOptionFlow: PropTypes.func,
        setTableInfo: PropTypes.func,
        setLoader: PropTypes.func,
        exportTableFlow: PropTypes.func,
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
        this.toggleActions = this.toggleActions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onChangeTextFilter = this.onChangeTextFilter.bind(this);
        this.exportTermOfAccept = this.exportTermOfAccept.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
    }

    componentWillMount() {
        const gridApi = this.props.gridApi;
        const columns = this.props.columns;
        const hideButtons = this.props.hideButtons;
        const urlLink = this.props.urlLink;
        const apiSpartan = this.props.apiSpartan;
        const columnsAlt = this.props.columnsAlt;

        columns.map(item => {
            item.filterable === true && !item.customFilter?
            item.Filter = ({ filter, onChange }) => (
                <input type="text" value={filter} style={{width:  "100%"}} 
                    onBlur={event => this.onChangeTextFilter(event.target.value, item.accessor)}
                    onKeyDown={event => event.keyCode === 13?this.onChangeTextFilter(event.target.value, item.accessor):''}
                />
            ):""
        })

        const tableInfo = {
            data_api: apiSpartan,
            pageSize: gridApi.pageSize,
            page: gridApi.page,
            filtered: [],
            sorted: gridApi.sorted
        }

        this.props.loadColumnsFlow(columns, hideButtons, urlLink, apiSpartan, tableInfo);
        this.props.setTableInfo(tableInfo);
    }

    onChangeTextFilter(filter, accessor) {
        const gridApi = this.props.gridApi;
        const filtered = gridApi.filtered;
        const tableInfo = gridApi.tableInfo;
        const new_object = {id: accessor, value: filter};

        this.props.loadFilterFlow(new_object, filtered, tableInfo, gridApi.apiFiltered);
    }

    toggle() {
        const gridApi = this.props.gridApi;
        const status = gridApi.dropdownOpen;
        this.props.toggleDropdownFlow(status);
    }

    toggleActions() {
        const gridApi = this.props.gridApi;
        const status = gridApi.dropdownActionsOpen;
        this.props.toggleDropdownActionsFlow(status);
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

    exportTermOfAccept() {
        this.props.setLoader(true);
        axios.get('school?filter[portfolio]=1&filter[active]=1')
            .then((response) => {
                const user = this.props.user;
                const data = response.data.data;
                const userFullName = user.full_name;

                generateTermOfAccept(userFullName, data);

                this.props.setLoader(false);
            })
            .catch(function (error) {
                console.log(error);
                alert(error);
            }.bind(this));
    }

    exportCSV() {
        const gridApi = this.props.gridApi;
        const tableInfo = gridApi.tableInfo;

        this.props.exportTableFlow(tableInfo);
    }

    /**
     * renderizaçāo da grid. 
     * Utilizada, especialmente, para colunas com select2
     */
    renderGrid(columnsGrid, dataAlternative, tableInfo) {
        let final_grid = [];
        const { apiSpartan, defaultOrder } = this.props;
        
        final_grid.push({
            expander: true,
            headerClassName: 'text-left',
            width: 30,
            Expander: ({ isExpanded, ...rest }) =>
                <div>
                {isExpanded
                    ? <span>&#x2296;</span>
                    : <span>&#x2295;</span>}
                </div>,
            style: {
                cursor: "pointer",
                fontSize: 25,
                padding: "0",
                textAlign: "center",
                userSelect: "none"
            },
        },)

        if (columnsGrid) {
            columnsGrid.map(item => {
                if (item.sub) {
                    item.style = { overflow: 'visible' },
                    item.Cell = (element) => {
                        let column_value = [];
                        if (item.sub) {
                            if (element.value) {
                                element.value.map(val => {
                                    if (!column_value.find(function (obj) { return obj === val[item.sub]; })) {
                                        column_value.push(val[item.sub])
                                    }
                                });
                            }
                    
                        } else {
                            column_value = element.value.map(val => {
                                return val.id
                            });
                        }

                        let seq = item.seq || 0;

                        return (
                            <div>
                                <Select
                                    autosize={true}
                                    name={item.sub ? item.sub : item.name}
                                    id={item.sub ? item.sub : item.name}
                                    onChange={(selectedOption) => {                
                                        const column_value_changed = selectedOption.map(function (cv) {
                                            return cv.id;
                                        });
                    
                                        let column_value_update = [];
                    
                                        if (item.sub) {
                                            column_value = selectedOption.map(function (cv) {
                                                return cv.id;
                                            }, {});
                                        }

                                        let name = item.sub && !item.name? item.sub : item.name;
                    
                                        column_value_update = selectedOption.map(function (cv, i) {
                                            let value = {};
                                            value[name] = cv.id;
                                            return value;
                                        }, {});
                    
                                        const updateData = {};
                    
                                        let id = 0;
                    
                                        for (var value in element.row['']) {
                                            if (value == 'id') {
                                                id = element.row[''][value]
                                            }
                                            else if (value != 'created_at' && value != 'updated_at' && value != 'deleted_at' && value != item.accessor) {
                                                updateData[value] = element.row[''][value];
                                            }
                                            else if (value == item.accessor) {
                                                if (item.accessor == 'visit_type_school_type') {
                                                    updateData[value] = getSchoolAndVisitValues(item.sub, column_value, column_value_changed, element.original.visit_type_school_type);
                                                } else {
                                                    updateData[value] = column_value_update;
                                                }
                                            }
                                        }
                    
                                        updateData.active = true;
                    
                                        //específico para API de regras
                                        if (this.props.apiSpartan == "rule") {
                                            const object = {role_id:1};
                                            updateData.roles.unshift(object);
                                        }

                                        this.props.selectOptionFlow(updateData, apiSpartan, id, tableInfo);
                    

                                    }}
                                    labelKey="name"
                                    valueKey="id"
                                    value={column_value}
                                    multi={item.type == 'selectMulti' ? true : false}
                                    disabled={element.original.deleted_at ? true : false}
                                    joinValues={false}
                                    placeholder="Selecione um valor"
                                    options={
                                        dataAlternative && dataAlternative[seq]?
                                        dataAlternative[seq][0]
                                        :[]}
                                    rtl={false}
                                />
                            </div>
                        )
                    }
                }
                final_grid = final_grid.concat(item);
            })
        }

        return final_grid;
    }

    render() {        
        const { columnsGrid, data, pages ,pageSize, dropdownOpen, columnsSelected, selectAll, loading, 
            dataAlternative, tableInfo, filtered, apiFiltered, dropdownActionsOpen 
        } = this.props.gridApi;
        const { apiSpartan, defaultOrder } = this.props;

        let final_grid = [];
        

        if (dataAlternative) {
            final_grid = this.renderGrid(columnsGrid, dataAlternative, tableInfo);
        }
        
        return (

            <div>
                <div className="section-dropdown">
                    {(!this.props.hideButtons && !this.props.hideFirstButton) 
                        && <NavLink to={this.props.urlLink + "/novo"} exact>
                            <Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button>
                        </NavLink>
                    }

                    {this.props.hasActions &&
                    <ButtonDropdown isOpen={dropdownActionsOpen} toggle={this.toggleActions}>
                            <DropdownToggle color='primary' caret>
                                Ações
                        </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.exportTermOfAccept}><i className="fa fa-file-text-o"></i> Termo de aceite</DropdownItem>
                                <DropdownItem onClick={this.exportCSV}><i className="fa fa-file-excel-o"></i> Exportar</DropdownItem>
                                <DropdownItem disabled><i className="fa fa-plus-circle"></i> Adicionar</DropdownItem>
                            </DropdownMenu>
                    </ButtonDropdown>
                    }
                    
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
                                (item.accessor == "" || item.sub)?"": 
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
                        if (column.Header) {
                            return {
                                onClick: e => {
    
                                    if (!rowInfo.original.deleted_at && (e.target.className === "fa fa-ban" || e.target.tagName === "BUTTON")) {
                                        this.props.onDeleteDataFlow(apiSpartan, rowInfo, state);
                                    }
    
                                    if (rowInfo.original.deleted_at && (e.target.className === "fa fa-check-circle" || e.target.tagName === "BUTTON")) {
                                        this.props.onActiveDataFlow(apiSpartan, rowInfo, state);
                                    }
    
                                }
                            }
                        } else {
                            return {}
                        }

                    }}
                    SubComponent={row => {

                        let school = row.original;

                        return (
                            <div style={{ padding: "20px" }}>
                                <b style={{ marginLeft: '20px' }}>Endereço:</b> {school.address}
                                <b style={{ marginLeft: '20px' }}>Bairro:</b> {school.neighborhood}
                                <b style={{ marginLeft: '20px' }}>Cidade:</b> {school.city}
                                <b style={{ marginLeft: '20px' }}>UF:</b> {school.state.abbrev}
                                <b style={{ marginLeft: '20px' }}>CEP:</b> {school.zip_code} <br />
                                <b style={{ marginLeft: '20px' }}>TOTVS:</b> {school.school_code_totvs}
                                <b style={{ marginLeft: '20px' }}>Tipo:</b> {school.school_type.name}
                                <b style={{ marginLeft: '20px' }}>Localização:</b> {school.localization_type ? school.localization_type.name : school.localization_type_id ? school.localization_type_id + ' Desativado' : 'Não há registro'}
                                {/* <b style={{ marginLeft: '20px' }}>Alunos:</b> {school.total_students || 0} */}
                                <b style={{ marginLeft: '20px' }}>Contatos:</b> {school.contacts.length}
                                <b style={{ marginLeft: '20px' }}>Telefone:</b> {school.phone}
                                <b style={{ marginLeft: '20px' }}>E-mail:</b> {school.email}
                            </div>
                        );
                    }}
                    columns={final_grid}
                    data={data}
                    pages={pages}
                    defaultPageSize={pageSize}
                    loading={loading}
                    manual
                    onFetchData={this.props.onFetchDataFlow}
                    data_api={apiSpartan}
                    api_filtered={apiFiltered}
                    defaultOrder={defaultOrder}
                    customFiltered={filtered}
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
    gridApi : state.gridApi,
    user: state.user
});

const functions_object = {
    loadColumnsFlow,
    onFetchDataFlow, 
    onDeleteDataFlow,
    onActiveDataFlow,
    toggleDropdownFlow,
    toggleDropdownActionsFlow,
    selectColumnsFlow,
    selectAllFlow,
    loadFilterFlow,
    selectOptionFlow,
    setTableInfo,
    setLoader,
    exportTableFlow
}

export default connect(mapStateToProps, functions_object )(GridApi);