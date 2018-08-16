import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';

import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 

class JobTitleList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <NavLink to={this.props.match.url + "/novo"} exact>
                        <Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button>
                    </NavLink>
                    <GridApi
                        apiSpartan="job-title"
                        columns={[
                            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Tipo", accessor: "job_title_type.name", width: 100, filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        urlLink={this.props.match.url}
                    />
                </div>  
            </div>
        )
    }
}

export default JobTitleList;