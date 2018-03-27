import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'

import '../../css/site.css';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../template/components/content/contentHeader'
import Content from '../../../template/components/content/content'
import Row from '../../../template/components/common/row'
import Grid from '../../../template/components/common/grid'

import content from '../../../template/components/content/content';
import InputCustomize from '../../../template/components/content/InputCustomize';

import Datatable from '../../../template/components/tables/Datatable';
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components'//'../../../template/components';
import axios from 'axios'

import PropTypes from 'prop-types'; 

class LoginError extends Component {
    render() {
        return(
            <div className="alert alert-danger" role="alert">
                Usuário ou senha inválido
            </div>
        )
    }
}
  
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password : '',
            valid_login : true};
        this.submitForm = this.submitForm.bind(this);        
        this.saveStorage = this.saveStorage.bind(this);
    }

    changeField(input) {
        var new_value = {};
        var input_name = input.target.id;
        new_value[input_name] = event.target.value;    
        this.setState(new_value);  
    }

    saveStorage(res) {
        if (res.data.access_token !== undefined) {
            window.location.reload()
            
            sessionStorage.setItem('token_type', res.data.token_type);
            sessionStorage.setItem('access_token', res.data.access_token);
            sessionStorage.setItem('refresh_token', res.data.refresh_token);
            sessionStorage.setItem('expires_in', res.data.expires_in); 
            this.setState({'valid_login' : true});
            window.location.href = "/#/home";
        } else {
            this.setState({'valid_login' : false});
        }

    }

    submitForm(event) {
        event.preventDefault();
        var url = "http://hapi.spartan.ftd.com.br/api/login";

        axios.post(url, {
            'grant_type': 'password', 
            'client_id': '2',
            'client_secret': 'X2zabNZ1I8xThjTgfXXIfMZfWm84pLD4ITrE70Yx',
            'username': this.state.login,
            'password': this.state.password,
            //'scope: '' 
        }).then(res => {
            this.saveStorage(res);
        })
    }
    
    render() {
        return(
            <section className="login-form">
                <h1>						
                    <img src="assets/img/logo-spartan.png" // place your logo here
							alt="Spartan" className="main-logo"/>
                </h1>
                {this.state.valid_login == false && <LoginError /> }
                <form onSubmit={this.submitForm} method="POST">
                    <div className="row">
                        <InputCustomize type="text" id="login" name="login" className="form-control" placeholder="Seu Login" 
                            helperText="" cols="col-lg-12 col-md-12 col-sm-12" value={this.state.login} onChange={this.changeField.bind(this)}
                            />

                        <InputCustomize type="password" id="password" name="password" className="form-control" placeholder="Sua Senha" 
                            helperText="Você deve informar as suas credenciais de rede" cols="col-lg-12 col-md-12 col-sm-12"
                            value={this.state.password} onChange={this.changeField.bind(this)}
                            />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">Acessar</button>
                </form>
            </section>
        )
    }
}

class Login extends Component {
    componentWillMount() {
        if (sessionStorage.getItem("access_token") !== null) {
            window.location.href = "#/schools";            
        }
    }
    render() {
        return ( 
            <div id="">
                <LoginForm />
            </div>
        )
    }
}

LoginForm.propTypes = {
    login: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};

export default Login;