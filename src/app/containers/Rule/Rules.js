import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import RuleList from './RuleList';
import RuleForm from './RuleForm';
import { canUser } from '../../common/Permissions';

class Rules extends Component {
    componentWillMount() {
        canUser('rule.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/config/permissoes' exact component={RuleList} />
                        <Route path='/config/permissoes/novo' exact component={RuleForm} />
                        <Route path='/config/permissoes/:id' component={RuleForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Rules;