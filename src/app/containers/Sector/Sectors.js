import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import SectorList from './SectorList';
import SectorForm from './SectorForm';

class Sectors extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/setores' exact component={SectorList} />
                    <Route path='/cadastro/setores/form' component={SectorForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Sectors;