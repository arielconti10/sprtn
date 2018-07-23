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
            profile_picture: PropTypes.string,
            full_name: PropTypes.string,
            email: PropTypes.string,
            superior: PropTypes.string,
            role_name: PropTypes.string,

        }),
        dropdownOpen: PropTypes.bool,

    }
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            ...props.user,
            dropdownOpen: false,
        };
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