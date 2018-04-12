import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import SchoolRegister from './SchoolRegister'
import SchoolConctactList from './SchoolContactList';
import SchoolStudentIcon from './SchoolStudentIcon'
import SchoolStudentList from './SchoolStudentList'
import SchoolAdoptionList from './SchoolAdoptionList'

class SchoolForm extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.contacts_global = [];
        this.state = {
            schoolName: '',
            contacts: [],
            schoolId: this.props.match.params.id,
            students: [],
            total_students: '0',
            activeTab: 'cadastro',
            schoolCodeTotvs: '0',
            subsidiaryId: '0',
            sectorId: '0'
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
                    contacts: dados.contacts || [],
                    active: dados.deleted_at === null ? true : false,
                    schoolCodeTotvs: dados.school_code_totvs,
                    subsidiaryId: dados.subsidiary_id,
                    sectorId: dados.sector_id
                });
            })
            .catch(err => console.log(err));
    }

    toggle(tab) {
        let contacts_tab = this.state.contacts;
        this.contacts_global = contacts_tab;
    
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                contacts: this.contacts_global
            });
        }
    }

    render() {
        // console.log(this.state.contacts);
        return (
            <div>
                <h1 className="school-header"><i className="fa fa-graduation-cap"></i> {this.state.schoolName} <SchoolStudentIcon numStudents={this.state.total_students} /></h1>
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
                            onClick={() => { this.toggle('contatos');  }}
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
                                <SchoolRegister viewMode={false} schoolId={this.state.schoolId} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="contatos">
                       
                        <Row>
                            <Col sm="12">
                                <SchoolConctactList schoolId={this.state.schoolId} contacts={this.state.contacts}/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="alunos">
                        <Row>
                            <Col sm="12">
                                <SchoolStudentList viewMode={false}  schoolId={this.state.schoolId} url={this.props.match.url} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="adocoes">
                        <Row>
                            <Col sm="12">
                                <SchoolAdoptionList schoolId={this.state.schoolId} schoolCodeTotvs={this.state.schoolCodeTotvs} subsidiaryId={this.state.subsidiaryId} sectorId={this.state.sectorId} />
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