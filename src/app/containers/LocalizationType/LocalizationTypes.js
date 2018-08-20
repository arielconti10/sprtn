import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import LocalizationTypeList from './LocalizationTypeList';
import {LocalizationTypeForm} from './LocalizationTypeForm';
import { canUser } from '../../common/Permissions';

class LocalizationTypes extends Component {
    componentWillMount() {
        canUser('localization.view', this.props.history, "view");
    }
    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">
                    <Switch>
                        <Route path='/cadastro/tipos-localizacao' exact component={LocalizationTypeList} />
                        <Route path='/cadastro/tipos-localizacao/novo' exact component={LocalizationTypeForm} />
                        <Route path='/cadastro/tipos-localizacao/:id' component={LocalizationTypeForm} />
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default LocalizationTypes;