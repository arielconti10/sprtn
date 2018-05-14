import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';


import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class ChainList extends Component {

    render() {

        return (
            <div>
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>

                <GridApi
                    apiSpartan="chain"
                    columns={[
                        { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' }
                    ]}
                />
            </div>
        )
    }
}

export default ChainList;