import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';

class Profiles extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/perfis' exact component={ProfileList} />
                    <Route path='/cadastro/perfis/form' component={ProfileForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Profiles;