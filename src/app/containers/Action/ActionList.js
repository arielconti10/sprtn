import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class ActionList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <NavLink to={this.props.match.url + "/novo"} exact>
                        <Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button>
                    </NavLink>
                    <GridApi
                        apiSpartan="action"
                        columns={[
                            { Header: "Nome", accessor: "name", filterable: true, width: 250, headerClassName: 'text-left', is_checked: true },
                        ]}
                        columnsAlt={[
                            { Header: "Tipo Visita", accessor: "visit_type_school_type", sub: 'visit_type_id', seq: 0, type: 'selectMulti', api: 'visit-type', filterable: true, headerClassName: 'text-left',
                            foldable: true },
                            { Header: "Tipo Escola", accessor: "visit_type_school_type", sub: 'school_type_id', seq: 1, type: 'selectMulti', api: 'school-type', filterable: true, headerClassName: 'text-left' },
                        ]}
                        urlLink={this.props.match.url}
                    />
                </div>  

            </div>
        )
    }
}

export default ActionList;