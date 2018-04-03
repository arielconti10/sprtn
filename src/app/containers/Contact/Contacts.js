import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ContactList from './ContactList';
import ContactForm from './ContactForm';

class Contacts extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/contatos' exact component={ContactList} />
                    <Route path='/cadastro/contatos/form' component={ContactForm} />                        
                </Col>
            </Row>
        )
    }
}

export default Contacts;