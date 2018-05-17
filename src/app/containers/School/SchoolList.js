import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory, Link, browserHistory, withRouter, NavLink, Redirect } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button, Row, Col } from 'reactstrap';
import ReactTable from 'react-table';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'react-table/react-table.css'

import axios from '../../common/axios';
import { verifyToken } from '../../common/AuthorizeHelper';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const wrapperStyle = { width: 400, margin: 50 };

class SchoolList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 10,
            data: [],
            authorized: 1,
            filtered: [],
            sorted: [],
            pages: null,
            loading: false,
            columns: [],
            studentsRange: [0, 9999],
            marketshareRange: [0, 100]
        };

        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.executeSearch = this.executeSearch.bind(this);
        this.showMarketShare = this.showMarketShare.bind(this);
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

    showMarketShare(marketshare){
        let value = 0;
        
        if(marketshare.length){
            marketshare.map(item => {
                if(item.key.search(/(?=.*EDITORAS:)(?=.*FTD)/gi) !== -1)
                    value = item.value
            })
        }

        return value;
    }

    componentDidMount() {

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
            { Header: "Alunos", accessor: "total_students", sortable: true, filterable: true, width: 70, headerClassName: 'text-left',
                Cell: props => <span>{props.value || 0}</span>
            },        
            { Header: "Market share", accessor: "marketshare", width: 100, headerClassName: 'text-left',
                Cell: props => <span>{this.showMarketShare(props.value)+'%'}</span>
            },     
            { Header: "Nome", accessor: "name", sortable: true, filterable: true, minWidth: 250, maxWidth: 500, headerClassName: 'text-left' },
            { Header: 'Tipo', accessor: 'school_type.name', sortable: true, filterable: true, width: 160, headerClassName: 'text-left' },
            {
                Header: "Identificação", accessor: "school_type", filterable: true, width: 120, headerClassName: 'text-left',
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
            { Header: 'Perfil', accessor: 'profile.name', sortable: true, filterable: true, width: 100, headerClassName: 'text-left' },
            { Header: 'Filial', accessor: 'subsidiary.name', filterable: true, width: 60, headerClassName: 'text-left' },
            { Header: 'Setor', accessor: 'sector.name', filterable: true, width: 60, headerClassName: 'text-left' },
            { Header: "TOTVS", accessor: "school_code_totvs", filterable: true, width: 100, headerClassName: 'text-left' },
            {
                Header: "Status",
                accessor: "",
                width: 100,
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
            { Header: "CEP", accessor: "zip_code", filterable: true, width: 100, headerClassName: 'text-left' },
            { Header: "Cidade", accessor: "city", filterable: true, width: 160, headerClassName: 'text-left' },
            { Header: "UF", accessor: "state.abbrev", filterable: true, width: 50, headerClassName: 'text-left' }
        ];

        this.setState({ columns: col });

    }

    onFetchData = (state, instance) => {
        console.log(state)
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

        filtered.map(function (item) {
            let id = item.id == 'school_type' ? `${item.id}.identify` : item.id;
            let value = item.value;
            baseURL += `&filter[${id}]=${value}`;
        })

        for (let i = 0; i < sorted.length; i++) {
            if(sorted[i]['id'] !== 'marketshare')
                baseURL += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
        }

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

    render() {
        const { data, pageSize, page, loading, pages, columns, studentsRange, marketshareRange } = this.state;

        if (this.state.authorized == 0) {
            return (
                <Redirect to="/login" />
            );
        }

        return (
            <div>
                <Row>
                    <Col md="2">                        
                        <NavLink to={this.props.match.url + "/novo"} exact>
                            <Button color='primary' disabled={true}><i className="fa fa-plus-circle"></i> Adicionar</Button>
                        </NavLink>
                    </Col>
                    <Col md="5">
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
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md="12">
                        <ReactTable
                            columns={columns}
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