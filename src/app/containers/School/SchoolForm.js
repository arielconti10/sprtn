import React, { Component } from 'react';

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

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadSchoolFlow} from '../../../actions/school'


import './School.css';

class SchoolForm extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadSchoolFlow: PropTypes.func,
        school: PropTypes.shape({
            // data_year: PropTypes.array,
        }),
    }

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            view_mode: false,
            active_tab: 'dashboard',
        };
    }

    componentDidMount(){
        const user = this.props.user;
        const school_id = this.props.match.params.id;
        this.props.loadSchoolFlow(user, school_id);
    }

    toggle(tab) {
        if (this.state.active_tab !== tab) this.setState({ active_tab: tab });
    }

    show_meeting(school_type) {
        if (school_type) {
            return school_type.identify.toLowerCase() == 'secretaria' ? '' : 'd-none';
        }
        
    }

    render() {
        const { active_tab, view_mode } = this.state;

        const { ringLoad, schoolInfo } = this.props.school;

        const { id, name, portfolio, active, total_students, total_students_ei, total_students_ef1, total_students_ef2, total_students_em, school_type, contacts, school_code_totvs, sector_id, subsidiary_id
        } = this.props.school.schoolInfo;

        const { } = this.state;

        return (
            <div>
                {ringLoad == true &&
                    <div className="loader">
                        <div className="backLoading">
                            <div className="load"></div>
                        </div>
                    </div>
                }
                
                <h1 className="school-header">
                    <i className="fa fa-building-o"></i> {name}
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
                <Nav tabs className={`tab-${schoolInfo.school_type?school_type.identify.toLowerCase():''}`}>
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
                        <NavLink className={classnames({ active: active_tab === 'meeting' }) 
                            + this.show_meeting(schoolInfo?school_type:'')} 
                            onClick={() => { this.toggle('meeting'); }}>
                            Reunião
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={active_tab} className={`cont-${schoolInfo.school_type?school_type.identify.toLowerCase():''}`}>
                    <TabPane tabId="dashboard">
                        <Row>
                            <Col sm="12">
                                <SchoolDashboard school={this.props.school.schoolInfo} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="register">
                        <Row>
                            <Col sm="12">
                                <SchoolRegister viewMode={view_mode} schoolId={id} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="contacts">
                        <Row>
                            <Col sm="12">
                                <SchoolConctactList schoolId={id} contacts={contacts} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="students">
                        <Row>
                            <Col sm="12">
                                <SchoolStudentList viewMode={view_mode} school={this.props.school.schoolInfo} schoolId={id} url={this.props.match.url} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="adoptions">
                        <Row>
                            <Col sm="12">
                                <SchoolAdoptionList schoolId={id} schoolCodeTotvs={school_code_totvs} subsidiaryId={subsidiary_id} sectorId={sector_id} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="actions">
                        <Row>
                            <Col sm="12">
                                <SchoolEventList school={this.props.school.schoolInfo} schoolType={school_type} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="distribution">
                        <Row>
                            <Col sm="12">
                                <SchoolDistributionList school={this.props.school.schoolInfo} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="meeting">
                        <Row>
                            <Col sm="12">
                                <SchoolMeeting schoolId={id} viewMode={view_mode} />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>

            </div>
        )
    }
}

const mapStateToProps =(state) => ({
    school : state.schools,
    user: state.user
});

const functions_object = {
    loadSchoolFlow
}

export default connect(mapStateToProps, functions_object )(SchoolForm);