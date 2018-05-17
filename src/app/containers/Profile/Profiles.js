import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';
import { canUser } from '../../common/Permissions';

class Profiles extends Component {
    componentWillMount() {
        canUser('profile.view', this.props.history, "view");
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="12" md="12">  
                <Switch>                       
                    <Route path='/cadastro/perfis' exact component={ProfileList} />
                    <Route path='/cadastro/perfis/novo' exact component={ProfileForm} />
                        <Route path='/cadastro/perfis/:id' component={ProfileForm} />
                    </Switch>                        
                </Col>
            </Row>
        )
    }
}

export default Profiles;