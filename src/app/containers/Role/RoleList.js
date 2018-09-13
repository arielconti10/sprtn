import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';

import GridApi from '../../common/GridApi';

class RoleList extends Component {
    render() {
        return (
            <div className="table-without-expand">
                <div className="action-button">
                    <GridApi
                        apiSpartan="role"
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

export default RoleList;