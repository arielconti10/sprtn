import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import LevelList from './LevelList';
import LevelForm from './LevelForm';

class Levels extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/niveis' exact component={LevelList} />
                        <Route path='/cadastro/niveis/novo' exact component={LevelForm} />
                        <Route path='/cadastro/niveis/:id' component={LevelForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Levels;