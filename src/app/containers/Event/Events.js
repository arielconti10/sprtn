import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import EventList from './EventList';
import EventForm from './EventForm';

class Events extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/eventos' exact component={EventList} />
                    <Route path='/cadastro/eventos/novo' component={EventForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Events;