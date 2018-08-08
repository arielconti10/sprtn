import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class ShiftList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                    
                    <GridApi
                        apiSpartan="shift"
                        columns={ [
                            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ] }
                        urlLink={this.props.match.url}
                    />

                </div>  

            </div>
        )
    }
}

export default ShiftList;