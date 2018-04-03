import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import SchoolTypeList from './SchoolTypeList';
import SchoolTypeForm from './SchoolTypeForm';

class SchoolTypes extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/tipos-escola' exact component={SchoolTypeList} />
                    <Route path='/cadastro/tipos-escola/form' component={SchoolTypeForm} />                        
                </Col>
            </Row>
        )
    }
}

export default SchoolTypes;