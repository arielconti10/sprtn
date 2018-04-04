import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ShiftList from './ShiftList';
import ShiftForm from './ShiftForm';

class Shifts extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">  
                <Switch>                       
                    <Route path='/cadastro/turnos' exact component={ShiftList} />
                    <Route path='/cadastro/turnos/novo' exact component={ShiftForm} />
                        <Route path='/cadastro/turnos/:id' component={ShiftForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Shifts;