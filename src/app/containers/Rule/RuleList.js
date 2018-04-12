import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

class RuleList extends Component {

    handleSelectChange = (selectedOption) => {

        const role_id = selectedOption.map(function(item) {
            return item.id;
        });

        this.setState({ role_id: role_id });
    }

    render() {

        return (
            <div>
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>

                <GridApi
                    apiSpartan="rule"
                    columns={[
                        // { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                        { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left' },
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' }
                    ]}
                    columnsAlt={[
                        { Header: 'Regras', accessor: 'roles', filterable: true, name: 'role_id', width: 400, type:'selectMulti', api: 'role', headerClassName: 'text-left'},
                    ]}
                />
            </div>
        )
    }
}

export default RuleList;