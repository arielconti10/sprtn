import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class SchoolTypeList extends Component {

    render() {

        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Tipos de Escola
                </CardHeader>
                <CardBody>  
                    <p>
                        <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>                        
                    </p>
                    <div>
                    <GridApi
                        apiSpartan="school-type"
                        columns={[
                            { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' }
                        ]}
                    />
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default SchoolTypeList;