import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import JobTitleList from './JobTitleList.1';
import JobTitleForm from './JobTitleForm';

class JobTitles extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/cargos' exact component={JobTitleList} />
                    <Route path='/cadastro/cargos/form' component={JobTitleForm} />                        
                </Col>
            </Row>
        )
    }
}

export default JobTitles;