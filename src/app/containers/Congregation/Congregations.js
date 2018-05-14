import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import CongregationList from './CongregationList';
import CongregationForm from './CongregationForm';

class Congregations extends Component {

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/congregacoes' exact component={CongregationList} />
                        <Route path='/cadastro/congregacoes/novo' exact component={CongregationForm} />
                        <Route path='/cadastro/congregacoes/:id' component={CongregationForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Congregations;