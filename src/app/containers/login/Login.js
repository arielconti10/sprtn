import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './Login.css';
import InputCustomize from '../../common/InputCustomize';
import axios from '../../common/axios';

import PropTypes from 'prop-types';

import Full from '../../../../src/template/containers/Full/Full'
import Dashboard from '../../../template/views/Dashboard/Dashboard';

class LoginError extends Component {
    render() {
        return (
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
            password: '',
            valid_login: null,            
        };
    }

    changeField = (input) => {
        var new_value = {};
        var input_name = input.target.id;
        new_value[input_name] = input.target.value;
        this.setState(new_value);
    }

    saveStorage = (res) => {
        if (res.data.access_token !== undefined) {
            //window.location.reload();
            sessionStorage.setItem('token_type', res.data.token_type);
            sessionStorage.setItem('access_token', res.data.access_token);
            sessionStorage.setItem('refresh_token', res.data.refresh_token);
            sessionStorage.setItem('expires_in', res.data.expires_in);
            this.setState({ 'valid_login': true });

        } else {
            this.setState({ 'valid_login': false, password: '' });
        }

    }

    submitForm = (event) => {
        event.preventDefault();

        axios.post('/login', {
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

        if (this.state.valid_login) {
            return (
                <Redirect to="/" />
            );
        }
        return (
            <section className="login-form">
                <h1>
                    <img src="./img/logo.png" // place your logo here
                        alt="Spartan" className="main-logo" />
                </h1>
                {this.state.valid_login == false && <LoginError />}
                <form onSubmit={this.submitForm} method="POST">
                    <div className="row">
                        <InputCustomize type="text" id="login" name="login" className="form-control" placeholder="Seu Login"
                            helptext="" cols="col-lg-12 col-md-12 col-sm-12" value={this.state.login} onChange={this.changeField.bind(this)}
                        />

                        <InputCustomize type="password" id="password" name="password" className="form-control" placeholder="Sua Senha"
                            helptext="Você deve informar as suas credenciais de rede" cols="col-lg-12 col-md-12 col-sm-12"
                            value={this.state.password} onChange={this.changeField.bind(this)}
                        />
                    </div>

                    <button onClick={() => this.submitForm()} className="btn btn-primary btn-block">Acessar</button>
                </form>
            </section>
        )
    }
}

class Login extends Component {
    componentWillMount() {
        if (sessionStorage.getItem("access_token") !== null) {
            window.location.href='#/dashboard';
        }
    }
    render() {
        return (
            <div id="login-body">
                <LoginForm />
            </div>
        )
    }
}
/*
LoginForm.propTypes = {
    login: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};*/

export default Login;