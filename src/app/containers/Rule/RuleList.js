import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';
import GridApi from '../../common/GridApi';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

class RuleList extends Component {

    render() {
        return (
            <div className="table-without-expand">
                <div className="action-button">
                    <GridApi
                        apiSpartan="rule"
                        columns={ [
                            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Regras", accessor: "roles", type: 'selectMulti', 
                                api: 'role', filterable: false, headerClassName: 'text-left',
                                width: 400, seq: 0,
                                sub: 'id',
                                name: "role_id",
                                id: 'roles'
                            },
                            // { Header: 'Regras', accessor: 'roles', filterable: true, name: 'role_id', width: 400, type:'selectMulti', api: 'role', headerClassName: 'text-left'},
                        ] }
                        columnsAlt={[
                            // { Header: 'Regras', accessor: 'roles', filterable: true, name: 'role_id', width: 400, type:'selectMulti', api: 'role', headerClassName: 'text-left'},
                        ]}
                        urlLink={this.props.match.url}
                    />

                </div>  
                <br />


            </div>
        )
    }
}

export default RuleList;