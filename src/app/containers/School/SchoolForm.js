import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';
import { verifyToken } from '../../../app/common/AuthorizeHelper';

import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import SchoolDashboard from './SchoolDashboard';
import SchoolDistributionList from './SchoolDistributionList';
import SchoolRegister from './SchoolRegister';
import SchoolConctactList from './SchoolContactList';
import SchoolStudentIcon from './SchoolStudentIcon';
import SchoolStudentList from './SchoolStudentList';
import SchoolAdoptionList from './SchoolAdoptionList';
import SchoolEventList from './SchoolEventList';

import { canUser, verifyViewMode } from '../../common/Permissions';

class SchoolForm extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.contacts_global = [];
        this.state = {
            viewMode: false,
            permission: true,
            schoolName: '',
            viewMode: false,
            contacts: [],
            authorized: 1,
            contacts_initial: [],
            active: false,
            portfolio: false,
            schoolId: this.props.match.params.id,
            students: [],
            total_students_ei: '0',
            total_students_ef1: '0',
            total_students_ef2: '0',
            total_students_em: '0',
            total_students: '0',
            activeTab: 'dashboard',
            schoolCodeTotvs: '0',
            subsidiaryId: '0',
            sectorId: '0',
            school_type_identify: '',
            marketshare: []
        };
    }

    componentWillMount(){
        this.getSchool();

    }

    getSchool() {
        axios.get(`school/${this.state.schoolId}`)
        .then(response => {
            const dados = response.data.data;

                this.setState({
                    schoolName: dados.name,
                    total_students_ei: dados.total_students_ei || '0',
                    total_students_ef1: dados.total_students_ef1 || '0',
                    total_students_ef2: dados.total_students_ef2 || '0',
                    total_students_em: dados.total_students_em || '0',
                    total_students: dados.total_students || '0',
                    students: dados.students || [],
                    contacts: dados.contacts || [],
                    contacts_initial: dados.contacts || [],
                    active: dados.active == 1 ? true : false,
                    portfolio: dados.portfolio == 1 ? true : false,
                    schoolCodeTotvs: dados.school_code_totvs,
                    subsidiaryId: dados.subsidiary_id,
                    sectorId: dados.sector_id,
                    school_type_identify: dados.school_type.identify.toLowerCase(),
                    marketshare: dados.marketshare
                });

            })
            .catch(function (error) {
                let authorized = verifyToken(error.response.status);
                this.setState({ authorized: authorized });
            }.bind(this));

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            axios.get(`school/${this.state.schoolId}`)
                .then(response => {
                    const dados = response.data.data;
                    this.setState({
                        schoolName: dados.name,
                        total_students_ei: dados.total_students_ei || '0',
                        total_students_ef1: dados.total_students_ef1 || '0',
                        total_students_ef2: dados.total_students_ef2 || '0',
                        total_students_em: dados.total_students_em || '0',
                        total_students: dados.total_students || '0',
                        students: dados.students || [],
                        contacts: dados.contacts || [],
                        active: dados.active == 1 ? true : false,
                        portfolio: dados.portfolio == 1 ? true : false,
                        schoolCodeTotvs: dados.school_code_totvs,
                        subsidiaryId: dados.subsidiary_id,
                        sectorId: dados.sector_id,
                        school_type_identify: dados.school_type.identify.toLowerCase(),
                        marketshare: dados.marketshare
                    });
                })
                .catch(function (error) {
                    let authorized = verifyToken(error.response.status);
                    this.setState({ authorized: authorized });
                }.bind(this));

            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        if (this.state.authorized == 0) {
            return (
                <Redirect to="/login" />
            );
        }

        return (
            <div>
                <h1 className="school-header">
                    <i className="fa fa-building-o"></i> {this.state.schoolName}
                    <SchoolStudentIcon
                        portfolio={this.state.portfolio}
                        active={this.state.active}
                        eiStudents={this.state.total_students_ei}
                        ef1Students={this.state.total_students_ef1}
                        ef2Students={this.state.total_students_ef2}
                        emStudents={this.state.total_students_em}
                        numStudents={this.state.total_students}
                    />
                </h1>
                <br />
                <Nav tabs className={`tab-${this.state.school_type_identify}`}>
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
                            className={classnames({ active: this.state.activeTab === 'adocoes' }) + 'd-none'}
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
                            Ações
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'distribution' })}
                            onClick={() => { this.toggle('distribution'); }}
                        >
                            Distribuição
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} className={`cont-${this.state.school_type_identify}`}>
                    <TabPane tabId="dashboard">
                        <Row>
                            <Col sm="12">
                                <SchoolDashboard schoolId={this.state.schoolId} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="cadastro">
                        <Row>
                            <Col sm="12">
                                <SchoolRegister viewMode={this.state.viewMode} schoolId={this.state.schoolId} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="contatos">
                        <Row>
                            <Col sm="12">
                                <SchoolConctactList schoolId={this.state.schoolId} contacts={this.state.contacts} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="alunos">
                        <Row>
                            <Col sm="12">
                                <SchoolStudentList viewMode={this.state.viewMode} schoolId={this.state.schoolId} url={this.props.match.url} />
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
                                <SchoolEventList schoolId={this.state.schoolId} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="distribution">
                        <Row>
                            <Col sm="12">
                                <SchoolDistributionList />
                            </Col>
                        </Row>
                    </TabPane>

                </TabContent>

            </div>
        )
    }
}

export default SchoolForm;