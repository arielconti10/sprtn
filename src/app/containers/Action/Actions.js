import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import ActionList from './ActionList';
import ActionForm from './ActionForm';

class Actions extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/acoes' exact component={ActionList} />
                        <Route path='/cadastro/acoes/novo' exact component={ActionForm} />
                        <Route path='/cadastro/acoes/:id' component={ActionForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Actions;