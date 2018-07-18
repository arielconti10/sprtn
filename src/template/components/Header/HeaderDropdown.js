import React, { Component } from 'react';
import {
    Badge,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown
} from 'reactstrap';
import './custom.css';
import axios from 'axios';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class HeaderDropdown extends Component {
    static propTypes = {
        user: PropTypes.shape({
            username: PropTypes.string,
            access_token: PropTypes.string,
            sso_token: PropTypes.string,
        }),
        dropdownOpen: PropTypes.bool,
        
    }
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        // this.state = {
        //     dropdownOpen: false,
        //     full_name: sessionStorage.getItem('user_fullName'),
        //     username: sessionStorage.getItem('user_userName'),
        //     role_name: sessionStorage.getItem('role_name'),
        //     superior: sessionStorage.getItem('superior'),
        //     email: sessionStorage.getItem('user_email'),
        //     profile_picture: ''
        // };
    }

    componentWillMount() {
        this.getUserPhoto();
    }

    restoreSsoKey() {
        axios.post(`${process.env.API_URL}/login`, {
            'grant_type': 'password',
            'client_id': '2',
            'client_secret': 'X2zabNZ1I8xThjTgfXXIfMZfWm84pLD4ITrE70Yx',
            'username': this.props.user.username,
            'password': sessionStorage.getItem('password')
        }).then(res => {
            sessionStorage.removeItem('sso_token');
            sessionStorage.setItem('sso_token', res.data.sso_token);
            this.props.user.sso_token = res.data.sso_token;

            const key = sessionStorage.getItem('sso_token');
            const user = sessionStorage.getItem('user_userName');
            const baseURL = `https://login.ftd.com.br/api/photo/${key}/${user}`;

            this.setState({profile_picture:baseURL});
        })
        .catch(error => {
            let msg_error = error.response.statusText;
            if (error.response.status == 403 || error.response.status == 401) {
                 msg_error = "Usuário ou senha incorretos"; 
            }
            this.setState({back_error:msg_error, ringLoad: false, login: '', password: ''});
        });
    }
    
    getUserPhoto() {
        const key = this.props.user.sso_token;
        const user = this.props.user.username;
        // const key = sessionStorage.getItem('sso_token');
        // const user = sessionStorage.getItem('user_userName');


        const baseURL = `https://login.ftd.com.br/api/photo/${key}/${user}`;
        
        axios.get(baseURL, {
        }).then(res => {
            return true;
        }).catch(function (error) {
            const status = error.response.status;

            if (status == 401) {
                //realiza a chamada do login pra capturar nova chave
                this.restoreSsoKey();
            }
        }.bind(this));

        this.setState({profile_picture:baseURL});
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    dropAccnt() {
        const { full_name, username, role_name, superior, email, profile_picture } = this.props.user;
        
        return (
            <div>
                <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle nav>
                        <img src={profile_picture} className="img-avatar" alt="Avatar" />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem header tag="div" className="login-title">
                            <i className="fa fa-user"></i> Informações do Usuário
                        </DropdownItem>
                            <DropdownItem className="normal-option">
                                <strong>Usuário:</strong> {username}
                            </DropdownItem>
                            <DropdownItem className="normal-option">
                                <strong>Nome Completo:</strong> {full_name}
                            </DropdownItem>
                            <DropdownItem className="normal-option">
                                <strong>E-mail:</strong> {email}
                            </DropdownItem>
                            <DropdownItem className="normal-option">
                                <strong>Tipo:</strong> {role_name}
                            </DropdownItem>
                            <DropdownItem className="normal-option">
                                <strong>Superior:</strong> {superior}
                            </DropdownItem>
                            {/* <DropdownItem divider/> */}
                        <a href="/#/logout">
                            <DropdownItem>
                                <i className="fa fa-lock"></i> Sair
                            </DropdownItem>
                        </a>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }

    render() {
        const { ...attributes } = this.props;
        return (
            this.dropAccnt()
        );
    }
}
// Grab only the piece of state we need
const mapStateToProps = state => ({
    user: state.user,
    dropdownOpen: state.dropdownOpen
})

// make Redux state piece of `login` and our action `loginRequest`
// available in this.props within our component
const connected = connect(mapStateToProps)(HeaderDropdown)

export { connected as HeaderDropdown } 