import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Login from '../../../app/containers/login/Login'
import Dashboard from '../../views/Dashboard/';
import Schools from '../../../app/containers/School/Schools'
import JobTitles from '../../../app/containers/JobTitle/JobTitles'
import Subsidiaries from '../../../app/containers/Subsidiary/Subsidiaries'

class Full extends Component {

    render() {
        
        const token = sessionStorage.getItem('access_token');
        if (token == undefined) {
            return (
                <Redirect to="/login" />
            );
        }


        return (
            <div className="app">
                <Header />
                <div className="app-body">
                    <Sidebar {...this.props}/>
                    <main className="main">
                        <Breadcrumb />
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                                <Route path="/carteira/escolas" name="Carteira" component={Schools}/>
                                <Route path="/cadastro/cargos" name="Cargos" component={JobTitles}/>
                                <Route path="/cadastro/filiais" name="Filiais" component={Subsidiaries}/>
                                <Redirect from="/" to="/dashboard" />
                            </Switch>
                        </Container>
                    </main>
                    <Aside />
                </div>
                <Footer />
                
            </div>
        );
    }
}

export default Full;
