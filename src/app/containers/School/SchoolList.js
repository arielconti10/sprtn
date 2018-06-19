import React, { Component, createRef } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter, NavLink, Redirect } from 'react-router-dom'

import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input, Row, Col } from 'reactstrap';

import ReactTable from 'react-table';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'react-table/react-table.css'

import axios from '../../common/axios';
import { verifyToken } from '../../common/AuthorizeHelper';
import { canUser } from '../../common/Permissions';
import { generateTermOfAccept } from '../../common/GenerateTermOfAccept'
import { convertArrayOfObjectsToCSV } from '../../common/GenerateCSV'
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip prefixCls="rc-slider-tooltip" overlay={value} visible={dragging} placement="top" key={index}>
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

const wrapperStyle = { width: 400, margin: 50 };

class SchoolList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewMode: false,

            dropdownOpenTable: false,
            ringLoad: false,

            urlNoPaginate: '',

            page: 1,
            pageSize: 10,
            data: [],
            authorized: 1,
            filtered: [],
            sorted: [],
            pages: null,
            loading: false,
            columns: [],
            initial_columns: [],
            table_columns :[],
            select_all: true,

            studentsRange: [0, 9999],
            marketshareRange: [0, 100]
        };

        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.executeSearch = this.executeSearch.bind(this);
        this.showMarketShare = this.showMarketShare.bind(this);
        this.toggle = this.toggle.bind(this);
        this.exportTermOfAccept = this.exportTermOfAccept.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.toggleDrop = this.toggleDrop.bind(this);
        this.handleChangeDrop = this.handleChangeDrop.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }

    toggleDrop() {
        this.setState({
          dropdownOpenTable: !this.state.dropdownOpenTable
        });
    }

    handleChangeDrop(e) {
        const target = e.currentTarget;
        const columns_map = verifySelectChecked(target, this.state.initial_columns);
        const columns_filter = createTable(this.state.initial_columns);

        savePreferences("prefs_school", columns_filter);

        if (columns_filter.length === 2) {
            this.setState({ select_all : false });
        }

        if (columns_filter.length === columns_map.length) {
            this.setState({ select_all : true });
        }

        this.setState({ initial_columns: columns_map, table_columns: columns_filter });
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({ viewMode: true });
            }
        }.bind(this));       
    }

    exportCSV() {
        this.setState({ ringLoad: true });

        let urlNoPaginate = this.state.urlNoPaginate;
        console.log('urlNoPaginate:', urlNoPaginate);

        axios.get(urlNoPaginate)
            .then((response) => {
                const data = response.data.data;
                let newData = [];

                data.map(school => {
                    let register = {};

                    for (let i in school) {
                        if (i != 'students' && i != 'events' && i != 'contacts' && i != 'users' && i != 'secretary' && i != 'marketshare') {
                            let value;
                            
                            if (i == 'school_type' || i == 'subsidiary' || i == 'sector' || i == 'state' || i == 'chain' || i == 'profile' || i == 'congregation') {
                                school[i] ? value = school[i]['name'] : value = school[i];
                            } else {
                                value = school[i];
                            }

                            register[i] = `'${value}`;
                        }
                    }

                    newData.push(register);
                });

                convertArrayOfObjectsToCSV({ data: newData, fileName: 'spartan_escolas' });

                this.setState({ ringLoad: false });
            })
            .catch(function (error) {
                console.log(error);
                alert(error);

                this.setState({ ringLoad: false });
            }.bind(this));
    }

    exportTermOfAccept() {
        this.setState({ ringLoad: true });

        axios.get('school?filter[portfolio]=1&filter[active]=1')
            .then((response) => {
                const data = response.data.data;
                let user = sessionStorage.getItem('user_fullName');

                generateTermOfAccept(user, data);

                this.setState({ ringLoad: false });
            })
            .catch(function (error) {
                console.log(error);
                alert(error);

                this.setState({ ringLoad: false });
            }.bind(this));
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    onChangeFilter(target, empty) {
        let oldFilters = this.state.filtered;

        let clearFilters = [
            { id: "school_type" },
            { id: "active" }
        ];

        let newFilters = [];
        let auxFilters = [];

        if (empty) {
            clearFilters.map(clear => {
                oldFilters.map((elem, index, arr) => {
                    if (elem['id'] == clear.id) {
                        auxFilters.push(elem);
                    }
                });
            });
        }

        if (target.filtered && target.filtered.length > 0) {
            target.filtered.map(obj => {
                newFilters = oldFilters.filter((elem, index, arr) => elem['id'] != obj.id);

                if (obj.value != '') {
                    newFilters.push({ id: obj.id, value: obj.value });
                }
            });
        } else if (target && target.length > 0) {
            target.map(obj => {
                newFilters = oldFilters.filter((elem, index, arr) => elem['id'] != obj.id);

                if (obj.value != '') {
                    newFilters.push({ id: obj.id, value: obj.value });
                }
            });
        } else {
            newFilters = auxFilters[0] ? auxFilters : [];
        }

        const values = this.state;
        values.filtered = newFilters;

        if (target.pageSize) {
            values.pageSize = target.pageSize;
        }
        if (target.page) {
            values.page = target.page + 1;
        }
        if (target.sorted) {
            values.sorted = target.sorted;
        }
        this.setState({ values });

        this.onFetchData();
    }

    showMarketShare(marketshare) {
        let value = 0;

        if (marketshare.length) {
            marketshare.map(item => {
                if (item.key.search(/(?=.*EDITORAS:)(?=.*FTD)/gi) !== -1)
                    value = item.value
            })
        }

        return value;
    }

    getColumns() {
        let col = [
            {
                Header: "Ações", accessor: "", sortable: false, width: 50, headerClassName: 'text-left', Cell: (element) => (
                    <div>
                        <Link to={this.props.match.url + "/" + element.value.id}
                            params={{ id: element.value.id }} className='btn btn-primary btn-sm' >
                            <i className='fa fa-eye'></i>
                        </Link>
                    </div>
                )
            },
            {
                Header: "Alunos", accessor: "total_students", sortable: true, width: 70, headerClassName: 'text-left',
                is_checked: true,
                Cell: props => <span>{props.value || 0}</span>
            },
            {
                Header: "Market share", accessor: "marketshare", width: 100, headerClassName: 'text-left',
                is_checked: true,
                Cell: props => <span>{this.showMarketShare(props.value) + '%'}</span>
            },
            { Header: "Nome", accessor: "name", sortable: true, filterable: true, minWidth: 250, maxWidth: 500, headerClassName: 'text-left'
                ,is_checked: true,
            },
            { Header: 'Tipo', accessor: 'school_type.name', sortable: true, filterable: true, width: 160, headerClassName: 'text-left', sortable: false 
            ,is_checked: true,
            },
            {
                Header: "Identificação", accessor: "school_type", filterable: true, width: 120, headerClassName: 'text-left', sortable: false,
                is_checked: true,
                Cell: props => <span className={`escola-${props.value.identify.toLowerCase()}`}>{props.value.identify}</span>,
                Filter: ({ filter, onChange }) => (
                    <select id="school_type" onChange={event => this.onChangeFilter([event.target])} style={{ width: "100%" }} >
                        <option value="">Todos</option>
                        <option value="particular">Particular</option>
                        <option value="publico">Público</option>
                        <option value="secretaria">Secretaria</option>
                    </select>
                )
            },
            { Header: 'Perfil', accessor: 'profile.name', sortable: true, filterable: true, width: 100, headerClassName: 'text-left', sortable: false
                ,is_checked: true
            },
            { Header: 'Filial', accessor: 'subsidiary.name', filterable: true, width: 60, headerClassName: 'text-left', sortable: false 
                ,is_checked: true,
            },
            { Header: 'Setor', accessor: 'sector.name', filterable: true, width: 60, headerClassName: 'text-left', sortable: false 
                ,is_checked: true,
            },
            { Header: "TOTVS", accessor: "school_code_totvs", filterable: true, width: 100, headerClassName: 'text-left' 
                ,is_checked: true,
            },
            {
                Header: "Status",
                accessor: "",
                width: 100,
                is_checked: true,
                headerClassName: 'text-left',
                sortable: false,
                Cell: (element) => (
                    element.value.active ?
                        <div><span className="alert-success grid-record-status">Ativo</span></div>
                        :
                        <div><span className="alert-danger grid-record-status">Inativo</span></div>
                ),
                filterable: true,
                Filter: ({ filter, onChange }) => (
                    <select id="active" onChange={event => this.onChangeFilter([event.target])} style={{ width: "100%" }} >
                        <option value="">Todos</option>
                        <option value="1">Ativo</option>
                        <option value="0">Inativo</option>
                    </select>
                )
            },
            { Header: "CEP", accessor: "zip_code", filterable: true, width: 100, headerClassName: 'text-left' 
                ,is_checked: true,
            },
            { Header: "Cidade", accessor: "city", filterable: true, width: 160, headerClassName: 'text-left' 
                ,is_checked: true,
            },
            { Header: "UF", accessor: "state.abbrev", filterable: true, width: 50, headerClassName: 'text-left',is_checked: true }
        ];

        return col;
    }

    componentWillMount(){
        this.checkPermission('school.insert');
        const table_columns = this.getColumns();
        this.setState({ table_columns, initial_columns : table_columns }, function() {
            const table_preference = verifyPreferences(this.state.table_columns, 'prefs_school');
            const columns_filter = createTable(table_preference);

            if (columns_filter.length === 2) {
                this.setState({ select_all : false });
            }
    
            if (columns_filter.length === table_columns.length) {
                this.setState({ select_all : true });
            }
    
            this.setState({ table_columns: columns_filter });
        } );
    }

    componentDidMount() {

        let col = this.getColumns();

        this.setState({ columns: col });

    }

    onFetchData = (state, instance) => {
        let apiSpartan = this.props.apiSpartan;

        if (state) {
            if (state.filtered.length > 0) {
                this.onChangeFilter(state, false);
            } else {
                this.onChangeFilter(state, true);
            }
        }

        let pageSize = state ? state.pageSize : this.state.pageSize;
        let page = state ? state.page + 1 : this.state.page;
        let sorted = state ? state.sorted : this.state.sorted;
        let filtered = this.state.filtered

        let baseURL = `/school?paginate=${pageSize}&page=${page}`;
        let urlNoPaginate = '/school?';

        filtered.map(function (item) {
            let id = item.id == 'school_type' ? `${item.id}.identify` : item.id;
            let value = item.value;
            baseURL += `&filter[${id}]=${value}`;
            urlNoPaginate += `&filter[${id}]=${value}`;
        })

        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i]['id'] !== 'marketshare') {
                baseURL += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
                urlNoPaginate += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
            }
        }

        this.setState({ urlNoPaginate })

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data.data
                this.setState({
                    data: dados,
                    totalSize: response.data.meta.pagination.total,
                    pages: response.data.meta.pagination.last_page,
                    page: response.data.meta.pagination.current_page,
                    pageSize: parseInt(response.data.meta.pagination.per_page),
                    sorted: sorted,
                    filtered: filtered,
                    loading: false
                });
            })
            .catch(function (error) {
                let authorized = verifyToken(error.response.status);
                this.setState({ authorized: authorized });
            }.bind(this));
    }

    executeSearch() {
        console.log('executeSearch:');
        this.onFetchData();
    }

    handleSelectAll(event) {
        event.preventDefault();
        const select_inverse = !this.state.select_all;

        this.setState({ select_all: select_inverse });
        // if(!select_inverse) {
            const columns_map = this.state.initial_columns;

            columns_map.map((item) => {
                    item.is_checked = !this.state.select_all;
            });

            this.setState({ select_all : select_inverse, initial_columns: columns_map }, function() {
                const columns_filter = createTable(this.state.initial_columns);
                savePreferences("prefs_school", columns_filter);
                this.setState({ initial_columns: columns_map, table_columns: columns_filter, table_columns: columns_filter });
            });
        // }
    }

    render() {
        const { data, pageSize, page, loading, pages, columns, studentsRange, marketshareRange, ringLoad, dropdownOpen, viewMode,
            initial_columns, table_columns, dropdownOpenTable } = this.state;

        if (this.state.authorized == 0) {
            return (
                <Redirect to="/login" />
            );
        }

        return (
            <div>
                {ringLoad &&
                    <div className="loader-schools">
                        <div className="backLoading">
                            <div className="load"></div>
                        </div>
                    </div>
                }

                <Row>
                    <Col md="12">

                        <ButtonDropdown isOpen={dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle color='primary' caret>
                                Ações
                        </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.exportTermOfAccept}><i className="fa fa-file-text-o"></i> Termo de aceite</DropdownItem>
                                <DropdownItem disabled={viewMode} onClick={this.exportCSV}><i className="fa fa-file-excel-o"></i> Exportar</DropdownItem>
                                <DropdownItem disabled><i className="fa fa-plus-circle"></i> Adicionar</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                        {/* <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' disabled={true}><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink> */}

                        <ButtonDropdown isOpen={dropdownOpenTable} toggle={this.toggleDrop} className="dropdown-column">
                            <DropdownToggle caret color="primary">
                                Colunas
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox" 
                                                    value="all" onChange={this.handleSelectAll}
                                                    checked={this.state.select_all?"checked":""} 
                                                />{' '}
                                               <strong>Alternar Seleçāo</strong>
                                            </Label>
                                        </FormGroup>
                                </DropdownItem>
                                {initial_columns.map((item, key) => 
                                    item.accessor == ""?"":
                                    <DropdownItem disabled key={key}>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox" 
                                                    value={item.accessor} onChange={this.handleChangeDrop}
                                                    checked={item.is_checked?"checked":""} 
                                                />{' '}
                                                {item.Header}
                                            </Label>
                                        </FormGroup>
                                    </DropdownItem>
                            
                                )}

                            </DropdownMenu>
                        </ButtonDropdown>
                    </Col>
                    {/* <Col md="5">
                        <label>Alunos</label>
                        <Range
                            min={0}
                            max={9999}
                            tipFormatter={value => `${value}`}
                            value={studentsRange}
                            onChange={value => this.setState({ studentsRange: value })}
                            onAfterChange={this.executeSearch}
                            step={1}
                        />
                        <span>{studentsRange[0]} - {studentsRange[1]}</span>
                    </Col>
                    <Col md="5">
                        <label>Market share</label>
                        <Range
                            min={0}
                            max={100}
                            tipFormatter={value => `${value}%`}
                            value={marketshareRange}
                            onChange={value => this.setState({ marketshareRange: value })}
                            onAfterChange={this.executeSearch}
                            step={1}
                        />
                        <span>{marketshareRange[0]}% - {marketshareRange[1]}%</span>
                    </Col> */}
                </Row>
                <br />
                <Row>
                    <Col md="12">
                        <ReactTable
                            columns={table_columns}
                            data={data}
                            pages={pages}
                            loading={loading}
                            defaultPageSize={pageSize}
                            manual
                            onFetchData={this.onFetchData}
                            SubComponent={(row) => {
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
                            onExpandedChange={(expanded, index, event) => {
                                event.persist();
                            }}
                            previousText='Anterior'
                            nextText='Próximo'
                            loadingText='Carregando...'
                            noDataText='Sem registros'
                            pageText='Página'
                            ofText='de'
                            rowsText=''
                            className='-striped -highlight'
                        />
                    </Col>
                </Row>

            </div>
        )
    }
}

export default SchoolList;