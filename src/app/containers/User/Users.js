import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import UserList from './UserList';
import UserForm from './UserForm';

class Users extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12"> 
                    <Switch>
                        <Route path='/config/usuarios' exact component={UserList} />
                        <Route path='/config/usuarios/novo' exact component={UserForm} />                        
                        <Route path='/config/usuarios/:id' component={UserForm} />        
                    </Switch>                        
                </Col>
            </Row>
        )
    }
}

export default Users;