import React, { Component } from 'react';

import axios from '../../../app/common/axios';
import { verifyToken } from '../../../app/common/AuthorizeHelper';

import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import SchoolDashboard from './SchoolDashboard';
import SchoolDistributionList from './SchoolDistributionList';
import SchoolRegister from './SchoolRegister';
import SchoolConctactList from './SchoolContactList';
import SchoolStudentIcon from './SchoolStudentIcon';
import SchoolStudentList from './SchoolStudentList';
import SchoolAdoptionList from './SchoolAdoptionList';
import SchoolEventList from './SchoolEventList';
import SchoolMeeting from './SchoolMeeting';

import './School.css';

class SchoolForm extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.contacts_global = [];
        this.state = {
            view_mode: false,
            permission: true,
            school_name: '',
            show_meeting: 'd-none',
            contacts: [],
            authorized: 1,
            contacts_initial: [],
            active: false,
            portfolio: false,
            school_id: this.props.match.params.id,
            students: [],
            total_students_ei: '0',
            total_students_ef1: '0',
            total_students_ef2: '0',
            total_students_em: '0',
            total_students: '0',
            active_tab: 'dashboard',
            school_code_totvs: '0',
            subsidiary_id: '0',
            sector_id: '0',
            school_type_identify: '',
            marketshare: []
        };
    }

    componentWillMount(){
        this.getSchool();
    }

    getSchool() {
        axios.get(`school/${this.state.school_id}`)
        .then(response => {
            const dados = response.data.data;

                this.setState({
                    school_name: dados.name,
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
                    school_code_totvs: dados.school_code_totvs,
                    subsidiary_id: dados.subsidiary_id,
                    sector_id: dados.sector_id,
                    school_type_identify: dados.school_type.identify.toLowerCase(),
                    show_meeting: dados.school_type.identify.toLowerCase() == 'secretaria' ? '' : 'd-none',
                    marketshare: dados.marketshare
                });

            })
            .catch(function (error) {
                let authorized = verifyToken(error.response.status);
                this.setState({ authorized: authorized });
            }.bind(this)
        );
    }

    toggle(tab) {
        if (this.state.active_tab !== tab) this.setState({ active_tab: tab });
    }

    render() {
        const { 
            authorized, school_name, portfolio, active, total_students_ei, total_students_ef1, total_students_ef2, total_students_em, show_meeting,
            total_students, school_type_identify, active_tab, school_id, contacts, view_mode, school_code_totvs, subsidiary_id, sector_id
        } = this.state;

        if (authorized == 0)  return ( <Redirect to="/login" /> );
        
        return (
            <div>
                <h1 className="school-header">
                    <i className="fa fa-building-o"></i> {school_name}
                    <SchoolStudentIcon
                        portfolio={portfolio}
                        active={active}
                        eiStudents={total_students_ei}
                        ef1Students={total_students_ef1}
                        ef2Students={total_students_ef2}
                        emStudents={total_students_em}
                        numStudents={total_students}
                    />
                </h1>
                <br />
                <Nav tabs className={`tab-${school_type_identify}`}>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'dashboard' })} onClick={() => { this.toggle('dashboard'); }}>
                            Dashboard
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'register' })} onClick={() => { this.toggle('register'); }}>
                            Cadastro
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'contacts' })} onClick={() => { this.toggle('contacts'); }}>
                            Contatos
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'students' })} onClick={() => { this.toggle('students'); }}>
                            Alunos
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'adoptions' }) + 'd-none'} onClick={() => { this.toggle('adoptions'); }}>
                            Adoções
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'actions' })} onClick={() => { this.toggle('actions'); }}>
                            Ações
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'distribution' })} onClick={() => { this.toggle('distribution'); }}>
                            Distribuição
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: active_tab === 'meeting' }) + show_meeting} onClick={() => { this.toggle('meeting'); }}>
                            Reunião
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={active_tab} className={`cont-${school_type_identify}`}>
                    <TabPane tabId="dashboard">
                        <Row>
                            <Col sm="12">
                                <SchoolDashboard schoolId={school_id} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="register">
                        <Row>
                            <Col sm="12">
                                <SchoolRegister viewMode={view_mode} schoolId={school_id} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="contacts">
                        <Row>
                            <Col sm="12">
                                <SchoolConctactList schoolId={school_id} contacts={contacts} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="students">
                        <Row>
                            <Col sm="12">
                                <SchoolStudentList viewMode={view_mode} schoolId={school_id} url={this.props.match.url} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="adoptions">
                        <Row>
                            <Col sm="12">
                                <SchoolAdoptionList schoolId={school_id} schoolCodeTotvs={school_code_totvs} subsidiaryId={subsidiary_id} sectorId={sector_id} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="actions">
                        <Row>
                            <Col sm="12">
                                <SchoolEventList schoolId={school_id} />
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
                    <TabPane tabId="meeting">
                        <Row>
                            <Col sm="12">
                                <SchoolMeeting schoolId={school_id} viewMode={view_mode} />
                            </Col>
                        </Row>
                    </TabPane>

                </TabContent>

            </div>
        )
    }
}

export default SchoolForm;