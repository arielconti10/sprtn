import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class UserList extends Component {
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
        canUser('user.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    checkDeletePermission() {
        canUser('user.delete', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewDeleteMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission();
        this.checkDeletePermission();

        const table_columns = [
            { 
                Header: "Nome", 
                accessor: "full_name", 
                filterable: true, 
                headerClassName: 'text-left',
                is_compost: true,
                order_by: "name",
                filter_by: ["name", "lastname"],
                is_checked: true
            },
            { Header: "Email", accessor: "email", filterable: true, headerClassName: 'text-left', is_checked: true },
            { Header: "Usuário", accessor: "username", width: 100, filterable: true, headerClassName: 'text-left', is_checked: true },                        
            { Header: "Tipo", accessor: "role.name", filterable: true, headerClassName: 'text-left', sortable: false, is_checked: true },
            { Header: "Superior", accessor: "superior_name", filterable: true, headerClassName: 'text-left', is_checked: true }, 
        ];

        this.setState({ table_columns, initial_columns : table_columns });
    }

    handleChange(e) {
        const target = e.currentTarget;
        const columns_map = verifySelectChecked(target, this.state.initial_columns);
        const columns_filter = createTable(this.state.initial_columns);
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
                                (item.accessor == "")?"":
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
                    apiSpartan="user"
                    sortInitial="full_name"
                    columns={ table_columns }
                    blockEdit={this.state.viewMode}
                    blockDelete={this.state.viewDeleteMode}
                />
            </div>
        )
    }
}

export default UserList;