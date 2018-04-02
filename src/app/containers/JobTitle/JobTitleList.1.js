import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'


import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class JobTitleList extends Component {

    render() {

        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Cargos
                </CardHeader>
                <CardBody>  
                    <p>
                        <NavLink to={this.props.match.url + "/form"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>                        
                    </p>
                    <div>
                    <GridApi
                        apiSpartan="job-title"
                        columns={[
                            { Header: 'ID', accessor: 'id' },
                            { Header: "Nome", accessor: "name" }
                        ]}
                        cardHeader="Cargos"
                    />
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default JobTitleList;