import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom'

import 'rc-slider/assets/index.css';
import 'react-table/react-table.css'

import { canUser } from '../../common/Permissions';
import GridApi from '../../common/GridApi';

import { connect } from 'react-redux'
import { loadColumnsFlow, onFetchDataFlow, onDeleteDataFlow, onActiveDataFlow, toggleDropdownFlow, 
    selectColumnsFlow, selectAllFlow, loadFilterFlow, selectOptionFlow, setTableInfo
} from '../../../actions/gridApi';

class SchoolList extends Component {

    constructor(props) {
        super(props);
        this.showMarketShare = this.showMarketShare.bind(this);
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({ viewMode: true });
            }
        }.bind(this));       
    }

    onChangeTextFilter(filter, accessor) {
        const gridApi = this.props.gridApi;
        const filtered = gridApi.filtered;
        const tableInfo = gridApi.tableInfo;
        const new_object = {id: accessor, value: filter};

        this.props.loadFilterFlow(new_object, filtered, tableInfo, gridApi.apiFiltered);
    }

    showMarketShare(marketshare) {
        let value = 0;

        if (marketshare && marketshare.length) {
            marketshare.map(item => {
                if (item.key.search(/(?=.*EDITORAS:)(?=.*FTD)/gi) !== -1)
                    value = item.value
            })
        }

        return value;
    }

    render() {
        return (
            <div>
                <div className="action-button">
                    <GridApi
                        apiSpartan="school"
                        columns={[
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
                            { Header: "Nome", accessor: "name", filterable: true, width: 400, headerClassName: 'text-left', is_checked: true },
                            { Header: 'Tipo', 
                                accessor: 'school_type.name', 
                                sortable: true, 
                                filterable: true, width: 160, headerClassName: 'text-left', sortable: false 
                                ,is_checked: true 
                            },
                            {
                                Header: "Identificação", accessor: "school_type", filterable: true, width: 120, headerClassName: 'text-left', sortable: false,
                                is_checked: true,
                                customFilter: true,
                                Cell: props => props.value? 
                                    <span className={`escola-${props.value.identify.toLowerCase()}`}>{props.value.identify}
                                    </span>:'',
                                Filter: ({ filter, onChange }) => (
                                    <select id="school_type" 
                                    onChange={event => this.onChangeTextFilter(event.target.value, "school_type.identify")} 
                                    
                                    style={{ width: "100%" }} >
                                        <option value="">Todos</option>
                                        <option value="particular">Particular</option>
                                        <option value="publico">Público</option>
                                        <option value="secretaria">Secretaria</option>
                                    </select>
                                )
                            },
                            { Header: 'Perfil', accessor: 'profile.name', sortable: true, filterable: true, width: 100, headerClassName: 'text-left', 
                                sortable: false ,is_checked: true 
                            },
                            { Header: 'Filial', 
                                accessor: 'subsidiary.name', filterable: true, width: 60, headerClassName: 'text-left', sortable: false 
                                ,is_checked: true 
                            },
                            { Header: 'Setor', accessor: 'sector.name', filterable: true, width: 60, headerClassName: 'text-left', sortable: false 
                                ,is_checked: true },
                            { Header: "TOTVS", accessor: "school_code_totvs", filterable: true, width: 100, headerClassName: 'text-left' 
                                ,is_checked: true 
                            },    
                            {
                                Header: "Status",
                                accessor: "",
                                width: 100,
                                is_checked: true,
                                customFilter: true,
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
                                    <select id="active" onChange={event => this.onChangeFilter([event.target])} style={{ width: "100%" }} 
                                    onChange={event => this.onChangeTextFilter(event.target.value, "active")} >
                                        <option value="">Todos</option>
                                        <option value="1">Ativo</option>
                                        <option value="0">Inativo</option>
                                    </select>
                                )
                                
                            },
                            { Header: "CEP", accessor: "zip_code", filterable: true, width: 100, headerClassName: 'text-left' 
                                ,is_checked: true
                            },
                            { Header: "Cidade", accessor: "city", filterable: true, width: 160, headerClassName: 'text-left' 
                                ,is_checked: true
                            },
                            { Header: "UF", accessor: "state.abbrev", filterable: true, width: 50, headerClassName: 'text-left',is_checked: true }
                        ]}
                        hideButtons={true}
                        hasActions={true}
                        urlLink={this.props.match.url}
                    />
                </div>  

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
    selectAllFlow,
    loadFilterFlow,
    selectOptionFlow,
    setTableInfo
}

export default connect(mapStateToProps, functions_object )(SchoolList);