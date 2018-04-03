import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'


import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class ChainList extends Component {

    render() {

        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Estados
                </CardHeader>
                <CardBody>
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
                </CardBody>
            </Card>
        )
    }
}

export default ChainList;