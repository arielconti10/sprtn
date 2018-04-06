import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import SchoolRegister from './SchoolRegister'
import SchoolStudents from './SchoolStudents'
import SchoolConctactList from './SchoolContactList';

class SchoolForm extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            schoolName: '',
            schoolId: this.props.match.params.id,
            students: [],
            total_students: '0',
            activeTab: 'cadastro'
        };
    }

    componentWillMount() {

        axios.get(`school/${this.state.schoolId}`)
            .then(response => {
                const dados = response.data.data;

                this.setState({
                    schoolName: dados.name, 
                    total_students: dados.total_students || '0',
                    students: dados.students || [],                  
                    active: dados.deleted_at === null ? true : false
                });
            })
            .catch(err => console.log(err));

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <div>
                <h1 className="school-header"><i className="fa fa-graduation-cap"></i> {this.state.schoolName} <SchoolStudents numStudents={this.state.total_students} /></h1>
                <br />
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'dashboard' })}
                            onClick={() => { this.toggle('dashboard'); }}
                        >
                            Dashboard
                            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'cadastro' })}
                            onClick={() => { this.toggle('cadastro'); }}
                        >
                            Cadastro
                            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'contatos' })}
                            onClick={() => { this.toggle('contatos'); }}
                        >
                            Contatos
                            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'alunos' })}
                            onClick={() => { this.toggle('alunos'); }}
                        >
                            Alunos
                            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'adocoes' })}
                            onClick={() => { this.toggle('adocoes'); }}
                        >
                            Adoções
                            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'agendas' })}
                            onClick={() => { this.toggle('agendas'); }}
                        >
                            Agenda
                            </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="dashboard">
                        <Row>
                            <Col sm="12">
                                <h2>Dashboard</h2>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="cadastro">
                        <Row>
                            <Col sm="12">
                                <SchoolRegister viewMode={false}  schoolId={this.state.schoolId} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="contatos">
                        <Row>
                            <Col sm="12">
                                <h2>Contatos</h2>
                                <SchoolConctactList />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="alunos">
                        <Row>
                            <Col sm="12">
                                <h2>Alunos</h2>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="adocoes">
                        <Row>
                            <Col sm="12">
                                <h2>Adoções</h2>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="agendas">
                        <Row>
                            <Col sm="12">
                                <h2>Agendas</h2>
                            </Col>
                        </Row>
                    </TabPane>

                </TabContent>

            </div>
        )
    }
}

export default SchoolForm;