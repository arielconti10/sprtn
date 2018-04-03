import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ShiftList from './ShiftList';
import ShiftForm from './ShiftForm';

class Shifts extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/turnos' exact component={ShiftList} />
                    <Route path='/cadastro/turnos/form' component={ShiftForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Shifts;