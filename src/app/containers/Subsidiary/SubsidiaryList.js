import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class SubsidiariesList extends Component {
    render() {
        return (
            <div className="table-without-expand">
                <div className="action-button">
                    <GridApi
                        apiSpartan="subsidiary"
                        columns={[
                            { Header: 'Código', accessor: 'code', filterable: true, width: 100, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        columnMap={"sectors"}
                        urlLink={this.props.match.url}
                    />

                </div>  
            </div>
        )
    }
}

export default SubsidiariesList;