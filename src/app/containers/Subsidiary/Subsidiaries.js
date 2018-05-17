import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import SubsidiaryList from './SubsidiaryList';
import SubsidiaryForm from './SubsidiaryForm';
import { canUser } from '../../common/Permissions';

class Subsidiaries extends Component {
    componentWillMount() {
        canUser('subsidiary.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">          
                    <Switch>             
                        <Route path='/cadastro/filiais' exact component={SubsidiaryList} />
                        <Route path='/cadastro/filiais/novo' exact component={SubsidiaryForm} />           
                        <Route path='/cadastro/filiais/:id' component={SubsidiaryForm} />         
                    </Switch>                                     
                </Col>
            </Row>
        )
    }
}

export default Subsidiaries;