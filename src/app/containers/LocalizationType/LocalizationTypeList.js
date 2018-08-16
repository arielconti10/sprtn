import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class LocalizationTypeList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <GridApi
                        apiSpartan="localization"
                        columns={ [
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ] }
                        urlLink={this.props.match.url}
                    />
                </div>  
            </div>
        )
    }
}

export default LocalizationTypeList;