import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import StateList from './StateList';
import { canUser } from '../../common/Permissions';

class States extends Component {
    componentWillMount() {
        canUser('state.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">                         
                    <Route path='/cadastro/estados' exact component={StateList} />                      
                </Col>
            </Row>
        )
    }
}

export default States;