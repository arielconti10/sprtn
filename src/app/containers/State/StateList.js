import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';

class ChainList extends Component {
    constructor() {
        super();

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);

        this.state = {
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

    componentWillMount() {
        const table_columns = [
            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true },
            { Header: "UF", accessor: "abbrev", filterable: true, headerClassName: 'text-left', is_checked: true }
        ];

        this.setState({ table_columns, initial_columns : table_columns }, function() {
            const table_preference = verifyPreferences(this.state.table_columns, 'prefs_state');
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

    handleChange(e) {
        const target = e.currentTarget;
        const columns_map = verifySelectChecked(target, this.state.initial_columns);
        const columns_filter = createTable(this.state.initial_columns);

        savePreferences("prefs_state", columns_filter);

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
                savePreferences("prefs_state", columns_filter);
                this.setState({ initial_columns: columns_map, table_columns: columns_filter, table_columns: columns_filter });
            });
        // }
    }

    render() {
        const { initial_columns, table_columns, dropdownOpen } = this.state;

        return (
            <div>
                <div className="action-button">
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
                    apiSpartan="state"
                    columns={table_columns}
                    hideButtons={true}
                />
            </div>
        )
    }
}

export default ChainList;