import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Login from '../../../app/containers/login/Login'
import Logout from '../../../app/containers/logout/Logout'
import Dashboard from '../../views/Dashboard/';
import Schools from '../../../app/containers/School/Schools'
import JobTitles from '../../../app/containers/JobTitle/JobTitles'
import Subsidiaries from '../../../app/containers/Subsidiary/Subsidiaries'
import Sectors from '../../../app/containers/Sector/Sectors'
import Disciplines from '../../../app/containers/Discipline/Disciplines'
import LocalizationTypes from '../../../app/containers/LocalizationType/LocalizationTypes'
import Profiles from '../../../app/containers/Profile/Profiles'
import Congregations from '../../../app/containers/Congregation/Congregations'

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
                                <Route path="/logout" name="Logout" component={Logout}/>
                                <Route path="/carteira/escolas" name="Carteira" component={Schools}/>
                                <Route path="/cadastro/cargos" name="Cargos" component={JobTitles}/>
                                <Route path="/cadastro/filiais" name="Filiais" component={Subsidiaries}/>
                                <Route path="/cadastro/setores" name="Setores" component={Sectors}/>
                                <Route path="/cadastro/disciplinas" name="Disciplinas" component={Disciplines}/>
                                <Route path="/cadastro/tipos-localizacao" name="Tipos de Localizaçāo" component={LocalizationTypes}/>
                                <Route path="/cadastro/perfis" name="Perfis" component={Profiles}/>
                                <Route path="/cadastro/congregacoes" name="Congregações" component={Congregations}/>
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
