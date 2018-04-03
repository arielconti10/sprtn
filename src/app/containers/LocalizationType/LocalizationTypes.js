import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import LocalizationTypeList from './LocalizationTypeList';
import LocalizationTypeForm from './LocalizationTypeForm';

class LocalizationTypes extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/tipos-localizacao' exact component={LocalizationTypeList} />
                    <Route path='/cadastro/tipos-localizacao/form' component={LocalizationTypeForm} />                        
                </Col>
            </Row>
        )
    }
}

export default LocalizationTypes;