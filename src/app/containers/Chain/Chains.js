import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ChainList from './ChainList';
import ChainForm from './ChainForm';

class Chains extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/redes' exact component={ChainList} />
                    <Route path='/cadastro/redes/form' component={ChainForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Chains;