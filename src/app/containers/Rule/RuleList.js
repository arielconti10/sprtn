import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import { canUser } from '../../common/Permissions';

class RuleList extends Component {
    constructor() {
        super();

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);

        this.state = {
            viewMode: false,
            viewDeleteMode: false,
            initial_columns: [],
            table_columns :[],
            select_all: true,
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    checkPermission() {
        canUser('rule.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    checkDeletePermission() {
        canUser('rule.delete', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewDeleteMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission();
        this.checkDeletePermission();

        const table_columns = [
            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
        ];

        this.setState({ table_columns, initial_columns : table_columns }, function() {
            const table_preference = verifyPreferences(this.state.table_columns, 'prefs_rule');
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

    handleSelectChange = (selectedOption) => {

        const role_id = selectedOption.map(function(item) {
            return item.id;
        });

        this.setState({ role_id: role_id });
    }

    handleChange(e) {
        const target = e.currentTarget;
        const columns_map = verifySelectChecked(target, this.state.initial_columns);
        const columns_filter = createTable(this.state.initial_columns);
        savePreferences("prefs_rule", columns_filter);

        if (columns_filter.length === 2) {
            this.setState({ select_all : false });
        }

        if (columns_filter.length === columns_map.length) {
            this.setState({ select_all : true });
        }
        this.setState({ initial_columns: columns_map, table_columns: columns_filter, table_columns: columns_filter });
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
                savePreferences("prefs_rule", columns_filter);
                this.setState({ initial_columns: columns_map, table_columns: columns_filter, table_columns: columns_filter });
            });
        // }
    }

    render() {
        const { initial_columns, table_columns, dropdownOpen } = this.state;

        return (
            <div>
                <div className="action-button">
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>

                    <ButtonDropdown isOpen={dropdownOpen} toggle={this.toggle} className="dropdown-column">
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
                                (item.accessor == "" || item.accessor == "roles")?"":
                                <DropdownItem disabled key={key}>
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

                <GridApi
                    apiSpartan="rule"
                    columns={ table_columns }
                    columnsAlt={[
                        { Header: 'Regras', accessor: 'roles', filterable: true, name: 'role_id', width: 400, type:'selectMulti', api: 'role', headerClassName: 'text-left'},
                    ]}
                    blockEdit={this.state.viewMode}
                    blockDelete={this.state.viewDeleteMode}
                />
            </div>
        )
    }
}

export default RuleList;