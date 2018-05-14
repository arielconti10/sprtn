import React, { Component } from 'react';
import {
    Badge,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown
} from 'reactstrap';

class HeaderDropdown extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            email: sessionStorage.getItem('user_email')
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    dropAccnt() {
        return (
            <div>
                <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle nav>
                        <img src={'img/avatar-user.ico'} className="img-avatar" alt="Avatar" />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem header tag="div" className="text-center"><strong>{this.state.email}</strong></DropdownItem>
                        {/* <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
                            <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
                            <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
                            <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
                            <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
                            <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
                            <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
                            <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
                            <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
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

export default HeaderDropdown;