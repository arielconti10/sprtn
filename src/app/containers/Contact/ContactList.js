import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class ContactList extends Component {

    render() {

        return (
            <div>
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>

                <GridApi
                    apiSpartan="contact"
                    columns={[
                        { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' },
                        { Header: "Cpf", accessor: "cpf", filterable: true, headerClassName: 'text-left' },
                        { Header: "E-mail", accessor: "email", filterable: true, headerClassName: 'text-left' },
                        { Header: "Endereço", accessor: "address", filterable: true, headerClassName: 'text-left' }
                    ]}
                />
            </div>
        )
    }
}

export default ContactList;