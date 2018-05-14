import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class ActionList extends Component {

    render() {

        return (
            <div>
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>
                <GridApi
                    apiSpartan="action"
                    columns={[
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' },
                    ]}
                    columnsAlt={[
                        { Header: "Tipo Escola", accessor: "visit_type_school_type", sub: 'school_type_id', width: 400, type: 'selectMulti', api: 'school-type', filterable: true, headerClassName: 'text-left' },
                        { Header: "Tipo Visita", accessor: "visit_type_school_type", sub: 'visit_type_id', width: 400, type: 'selectMulti', api: 'visit-type', filterable: true, headerClassName: 'text-left' }
                    ]}

                />
            </div>
        )
    }
}

export default ActionList;