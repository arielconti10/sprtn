import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import SchoolTypeList from './SchoolTypeList';
import SchoolTypeForm from './SchoolTypeForm';
import { canUser } from '../../common/Permissions';

class SchoolTypes extends Component {
    componentWillMount() {
        canUser('school-type.view', this.props.history, "view");
    }
    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/tipos-escola' exact component={SchoolTypeList} />
                        <Route path='/cadastro/tipos-escola/novo' exact component={SchoolTypeForm} />
                        <Route path='/cadastro/tipos-escola/:id' component={SchoolTypeForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default SchoolTypes;