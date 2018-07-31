import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';

import '../../../app/custom.css';

import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Logout from '../../../app/containers/logout/Logout';
import Schools from '../../../app/containers/School/Schools'
import SchoolForm from '../../../app/containers/School/SchoolForm'
import JobTitles from '../../../app/containers/JobTitle/JobTitles'
import Subsidiaries from '../../../app/containers/Subsidiary/Subsidiaries'
import Sectors from '../../../app/containers/Sector/Sectors'
import Disciplines from '../../../app/containers/Discipline/Disciplines'
import LocalizationTypes from '../../../app/containers/LocalizationType/LocalizationTypes'
import Profiles from '../../../app/containers/Profile/Profiles'
import Contacts from '../../../app/containers/Contact/Contacts'
import Actions from '../../../app/containers/Action/Actions'
import Events from '../../../app/containers/Event/Events'
import Shifts from '../../../app/containers/Shift/Shifts'
import Congregations from '../../../app/containers/Congregation/Congregations';
import Chains from '../../../app/containers/Chain/Chains';
import SchoolTypes from '../../../app/containers/SchoolType/SchoolTypes';
import States from '../../../app/containers/State/States';
import Levels from '../../../app/containers/Level/Levels';

import Roles from '../../../app/containers/Role/Roles';
import Rules from '../../../app/containers/Rule/Rules';
import Users from '../../../app/containers/User/Users';

import Marketshare from '../../../app/containers/MarketShare/MarketShare';

import {Indicators} from '../../../app/containers/Indicators/Indicators'

import UserSchools from '../../../app/containers/UserSchools/UserSchools';

import permissionsRequest from '../../../actions/user'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Full extends Component {
    static propTypes = {
        user: PropTypes.object,
        nav_itens: PropTypes.object
    }

    constructor(props) {
        super(props);

    }
    showMessagePermission() {
        const message = (sessionStorage.getItem('flash_message'))?
            <h4 className="alert alert-danger"> Acesso negado. Você nāo está autorizado a realizar esta açāo </h4>
            :'';
        sessionStorage.removeItem('flash_message');
        return message;
    }

    render() {
        const token = sessionStorage.getItem('access_token'); 
        if (token == undefined) {
            return (
                <Redirect to="/login" />
            );
        }
        const { nav_itens } = this.props.user
        return (
            <div className="app">
                <Header />
                <div className="app-body">
                    <Sidebar {...this.props} nav_itens={nav_itens}/>
                    <main className="main">
                        <Breadcrumb />

                        <Container fluid>
                            {
                                this.showMessagePermission()
                            }
                            <Switch>
                                {/* <Route path="/dashboard" name="Dashboard" component={Dashboard}/> */}

                                <Route path="/marketshare" name="marketshare" component={Marketshare}/>
                                
                                <Route path="/dashboard/indicadores" name="indicadores" component={Indicators}/>


                                <Route path="/logout" name="Logout" component={Logout}/>
                                <Route path="/carteira/escolas" name="Carteira" component={Schools} />
                                <Route path="/carteira/distribuicao" name="Distribuicao" component={UserSchools} />
                                {/*<Route path="/carteira/escolas/alunos" name="Carteira" component={SchoolForm}/>*/}
                                <Route path="/cadastro/cargos" name="Cargos" component={JobTitles}/>
                                <Route path="/cadastro/filiais" name="Filiais" component={Subsidiaries}/>
                                <Route path="/cadastro/setores" name="Setores" component={Sectors}/>
                                <Route path="/cadastro/disciplinas" name="Disciplinas" component={Disciplines}/>
                                <Route path="/cadastro/tipos-localizacao" name="Tipos de Localizaçāo" component={LocalizationTypes}/>
                                <Route path="/cadastro/perfis" name="Perfis" component={Profiles}/>
                                <Route path="/cadastro/perfis" name="Níveis" component={Levels}/>
                                <Route path="/cadastro/contatos" name="Contatos" component={Contacts}/>
                                <Route path="/cadastro/acoes" name="Acoes" component={Actions}/>
                                <Route path="/cadastro/eventos" name="Eventos" component={Events}/>
                                <Route path="/cadastro/niveis" name="Níveis" component={Levels}/>
                                <Route path="/cadastro/turnos" name="Turnos" component={Shifts}/>
                                <Route path="/cadastro/congregacoes" name="Congregações" component={Congregations}/>
                                <Route path="/cadastro/redes" name="Redes" component={Chains}/>
                                <Route path="/cadastro/tipos-escola" name="Tipos de Escola" component={SchoolTypes}/>
                                <Route path="/cadastro/estados" name="Estados" component={States}/>
                                <Route path="/config/regras" name="Regras" component={Roles}/>                                
                                <Route path="/config/permissoes" name="Permissões" component={Rules}/>
                                <Route path="/config/usuarios" name="Usuários" component={Users}/>

                                {/* <Redirect from="/" to="/dashboard/indicadores" /> */}
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


// Grab only the piece of state we need
const mapStateToProps = state => ({
    user: state.user,
  })
  
  // make Redux state piece of `login` and our action `loginRequest`
  // available in this.props within our component
  const connected = connect(mapStateToProps, { permissionsRequest })(Full)
  

export { connected as Full };
