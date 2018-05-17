import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import ChainList from './ChainList';
import ChainForm from './ChainForm';
import { canUser } from '../../common/Permissions';

class Chains extends Component {
    componentWillMount() {
        canUser('chain.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/redes' exact component={ChainList} />
                        <Route path='/cadastro/redes/novo' exact component={ChainForm} />
                        <Route path='/cadastro/redes/:id' component={ChainForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Chains;