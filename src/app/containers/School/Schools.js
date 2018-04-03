import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import SchoolList from './SchoolList';
import SchoolForm from './SchoolForm';

class Schools extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Route path='/carteira/escolas' exact component={SchoolList} />
                    <Route path='/carteira/escolas/form' component={SchoolForm} />                    
                </Col>
            </Row>
        )
    }
}

export default Schools;