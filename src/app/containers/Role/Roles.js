import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import RoleList from './RoleList';
import RoleForm from './RoleForm';

import RoleRules from './RoleRules'
import { canUser } from '../../common/Permissions';

class Roles extends Component {
    componentWillMount() {
        canUser('role.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/config/regras' exact component={RoleList} />
                        <Route path='/config/regras/novo' exact component={RoleForm} />
                        <Route path='/config/regras/:id/permissoes' exact component={RoleRules} />
                        <Route path='/config/regras/:id' component={RoleForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Roles;