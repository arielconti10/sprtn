import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable';

import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';
// import {SortableContainer, SortableElement} from 'react-sortable-hoc';


class DisciplineList extends Component {
    render() {
        return (
            <div className="table-without-expand">
                <div className="action-button">
                    <GridApi
                        apiSpartan="discipline"
                        columns={[
                            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Ordenação", accessor: "order", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        urlLink={this.props.match.url}
                    />

                </div>
            </div>
        )
    }
}

export default DisciplineList;