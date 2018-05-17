import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import SchoolList from './SchoolList';
import SchoolForm from './SchoolForm';
import { canUser } from '../../common/Permissions';


class Schools extends Component {
    componentWillMount() {
        canUser('school.view', this.props.history, "view");
    }
    
    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/carteira/escolas' exact component={SchoolList} />
                        <Route path='/cadastro/escolas/novo' component={SchoolForm} /> 
                        <Route path='/carteira/escolas/:id' component={SchoolForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Schools;