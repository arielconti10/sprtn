import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 

import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class DisciplineList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <GridApi
                        apiSpartan="discipline"
                        columns={[
                            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        urlLink={this.props.match.url}
                    />

                </div>  
            </div>
        )
    }
}

export default DisciplineList;