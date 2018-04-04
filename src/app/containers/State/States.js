import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import StateList from './StateList';
import StateForm from './StateForm';

class States extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/estados' exact component={StateList} />
                    <Route path='/cadastro/estados/form' component={StateForm} />                        
                </Col>
            </Row>
        )
    }
}

export default States;