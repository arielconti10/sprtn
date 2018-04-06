import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import SectorList from './SectorList';
import SectorForm from './SectorForm';

class Sectors extends Component {

    render() {
        return (
            <Row>
                
                    <Col xs="12" sm="12" md="12">            
                        <Switch>             
                            <Route path='/cadastro/setores' exact component={SectorList} />
                            <Route path='/cadastro/setores/novo' exact component={SectorForm} />           
                            <Route path='/cadastro/setores/:id' component={SectorForm} />         
                        </Switch>   
                    </Col>
            </Row>
        )
    }
}

export default Sectors;
