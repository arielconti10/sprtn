import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class ChainList extends Component {

    render() {

        return (
            <div>
                <GridApi
                    apiSpartan="state"
                    columns={[
                        { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' },
                        { Header: "UF", accessor: "abbrev", filterable: true, headerClassName: 'text-left' }
                    ]}
                    hideButtons={true}
                />
            </div>
        )
    }
}

export default ChainList;