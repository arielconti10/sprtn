import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import SchoolList from './SchoolList';
import SchoolForm from './SchoolForm';

class Schools extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/carteira/escolas' exact component={SchoolList} />
                        <Route path='/carteira/escolas/:id' component={SchoolForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Schools;