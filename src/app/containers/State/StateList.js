import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';

class ChainList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <GridApi
                        apiSpartan="state"
                        columns={[
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "UF", accessor: "abbrev", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        hideButtons={true}
                    />
                </div>
            </div>
        )
    }
}

export default ChainList;