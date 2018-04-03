import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import DisciplineList from './DisciplineList';
import DisciplineForm from './DisciplineForm';

class Disciplines extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/disciplinas' exact component={DisciplineList} />
                    <Route path='/cadastro/disciplinas/form' component={DisciplineForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Disciplines;