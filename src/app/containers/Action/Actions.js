import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ActionList from './ActionList';
import ActionForm from './ActionForm';

class Actions extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/acoes' exact component={ActionList} />
                    <Route path='/cadastro/acoes/form' component={ActionForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Actions;