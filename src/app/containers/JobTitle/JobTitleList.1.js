import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';


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
                        <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>                        
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