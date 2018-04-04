import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import SubsidiaryList from './SubsidiaryList';
import SubsidiaryForm from './SubsidiaryForm';

class Subsidiaries extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/filiais' exact component={SubsidiaryList} />
                    <Route path='/cadastro/filiais/form' component={SubsidiaryForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Subsidiaries;