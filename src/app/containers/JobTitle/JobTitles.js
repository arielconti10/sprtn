import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import JobTitleList from './JobTitleList';
import JobTitleForm from './JobTitleForm';
import { canUser } from '../../common/Permissions';

class JobTitles extends Component {
    componentWillMount() {
        canUser('job-title.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12"> 
                    <Switch>
                        <Route path='/cadastro/cargos' exact component={JobTitleList} />
                        <Route path='/cadastro/cargos/novo' exact component={JobTitleForm} />                        
                        <Route path='/cadastro/cargos/:id' component={JobTitleForm} />        
                    </Switch>                        
                </Col>
            </Row>
        )
    }
}

export default JobTitles;