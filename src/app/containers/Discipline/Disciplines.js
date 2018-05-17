import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import DisciplineList from './DisciplineList';
import DisciplineForm from './DisciplineForm';
import { canUser } from '../../common/Permissions';

class Disciplines extends Component {
    componentWillMount() {
        canUser('discipline.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/disciplinas' exact component={DisciplineList} />
                        <Route path='/cadastro/disciplinas/novo' exact component={DisciplineForm} />
                        <Route path='/cadastro/disciplinas/:id' component={DisciplineForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Disciplines;