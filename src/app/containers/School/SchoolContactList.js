import React, { Component } from 'react'
import axios from '../../../app/common/axios';
import { Link } from 'react-router-dom';
import { Collapse, Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import ContactForm from '../Contact/ContactForm';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import SchoolForm from './SchoolForm';
import SchoolDisciplineList from './SchoolDisciplineList';
const apiSpartan = 'contact';

import { canUser } from '../../common/Permissions';
import GridApi from '../../common/GridApi';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    loadContactsFlow, onDeleteContactDataFlow, onActiveContactDataFlow,
    addContactFlow, findContactFlow
} from '../../../actions/contact'

import { 
    job_titleLoad, unloadJobTitle
} from '../../../actions/job_title'

import { levelRequest } from '../../../actions/level'

class SchoolConctactList extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadContactsFlow: PropTypes.func,
        levelRequest: PropTypes.func,
        onDeleteContactDataFlow: PropTypes.func,
        onActiveContactDataFlow: PropTypes.func,
        addContactFlow: PropTypes.func,
        findContactFlow: PropTypes.func,
        job_titleLoad: PropTypes.func,
        unloadJobTitle: PropTypes.func,
        contact: PropTypes.shape({
        }),

    }
    
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.addContact = this.addContact.bind(this);
        this.state = {
            cSelected: [],
            view_mode: false,
            active_tab: 'dados',
            levels: [],
            contactInfo: [],
        };

        this.onDisciplineListChange = this.onDisciplineListChange.bind(this)
        this.onChangeJobTitle = this.onChangeJobTitle.bind(this)

        console.log(this.state)
    }

    onDisciplineListChange(discipline, item, checked,list) {
        this.state.cSelected = list;         
        this.setState({cSelected: [...this.state.cSelected]})
        console.log(this.state.cSelected)
    }

    onChangeJobTitle(jobTitle){
        this.props.job_titleLoad(this.props.user, jobTitle.value)
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        this.props.unloadJobTitle()
    }
    toggle(tab) {
        if (this.state.active_tab !== tab) this.setState({ active_tab: tab });
    }

    addContact() {
        const contact = this.props.contact;
        const collapse = contact.collapse;
        this.props.addContactFlow(collapse);
        this.props.unloadJobTitle();
    }

    onClickCancel(){
        this.state.contactInfo = []
        this.setState({contactInfo: [...this.state.contactInfo]})
        this.props.unloadJobTitle();
    }

    componentWillReceiveProps(nextProps) {
        const user = this.props.user;
        const contactProp = this.props.contact;
        const contacts = this.props.contacts;
        const contactInfo = this.props.contact.contactInfo;
        const job_title = this.props.job_title;

        if (contacts !== nextProps.contacts || contactProp.collapse !== nextProps.contact.collapse
            && nextProps.contact.contactsList.length === 0
        ) {
            const nextContacts = nextProps.contacts;
            const collapse = nextProps.contact.collapse;
            this.props.loadContactsFlow(user, nextContacts, collapse);
            this.props.levelRequest(user);
            this.setState({levels: this.props.levels.list})
        }

        
        if(nextProps.job_title && this.state.contactInfo.job_title !== nextProps.job_title.current_job_title) {
            this.setState({
                contactInfo: {
                    job_title: nextProps.job_title.current_job_title
                }
            });
        }
        
        if(typeof nextProps.contact.contactInfo.job_title !== 'undefined' && nextProps.contact.contactInfo.job_title !== null ){
            this.setState({contactInfo: nextProps.contact.contactInfo})
        }
    }

    renderDisciplines() {
        if(typeof this.state.levels !== 'undefined' && this.state.levels.length > 1){
            return this.state.levels.map(level =>
                <TabPane tabId={level.code}>
                    <SchoolDisciplineList level={level} schoolInfo={this.props.school.schoolInfo} onDisciplineChange = { this.onDisciplineListChange }/>
                </TabPane>
            );
        }   
    }
    
    render() {
        const { contactsList, collapse } = this.props.contact;
        const { user } = this.props;
        const { schoolInfo } = this.props.school;
        const { active_tab, view_mode, contactInfo } = this.state;


        return (
            <div>
                <div className="contact-action">
                    <Collapse isOpen={collapse}>
                            { 
                                typeof contactInfo.job_title !== 'undefined' && contactInfo.job_title !== null && contactInfo.job_title.code == 'PROFESSOR' ?
                                <Nav tabs className="tab-contacts">
                                    <NavItem>
                                        <NavLink className={classnames({ active: active_tab === 'dados' })} onClick={() => { this.toggle('dados'); }}>Dados</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: active_tab === 'ei' })} onClick={() => { this.toggle('ei'); }}>EI</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: active_tab === 'ef1' })} onClick={() => { this.toggle('ef1'); }}>EF1</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: active_tab === 'ef2' })} onClick={() => { this.toggle('ef2'); }}>EF2</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: active_tab === 'em' })} onClick={() => { this.toggle('em'); }}>EM</NavLink>
                                    </NavItem>
                                </Nav>
                                :
                                ''
                            }
                            
                        <TabContent activeTab={active_tab} className="cont-contacts">
                            <TabPane tabId="dados">
                                <Row>
                                    <Col sm="12">
                                        <Card>
                                            <CardBody>
                                                <ContactForm 
                                                    schoolId={schoolInfo.id}
                                                    addContact={this.addContact}
                                                    onChangeJobTitle={this.onChangeJobTitle}
                                                    // updateTable={this.updateTable.bind(this)} toggle={this.toggle.bind(this)}
                                                    onClickCancel={this.onClickCancel.bind(this)} 
                                                    // viewMode={this.state.viewMode} 
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            {this.renderDisciplines()}

                        </TabContent>
                        
                    </Collapse>

                    <button className='btn btn-primary' onClick={this.addContact} disabled={collapse}>
                        Adicionar
                    </button>
                </div>
                <div className="contact-table">
                    <br/>
                    <ReactTable
                        getTdProps={(state, rowInfo, column, instance) => {
                            if (column.Header) {
                                return {
                                    onClick: e => {
                                        if (!rowInfo.original.deleted_at && 
                                            (e.target.className === "fa fa-ban" || e.target.className === "btn btn-danger btn-sm")) {
                                            this.props.onDeleteContactDataFlow(user, apiSpartan, rowInfo, schoolInfo.id);
                                        }
        
                                        if (rowInfo.original.deleted_at && (e.target.className === "fa fa-check-circle" || e.target.tagName === "BUTTON")) {
                                            const phoneData = this.props.contact.phoneData;
                                            this.props.onActiveContactDataFlow(user, apiSpartan, rowInfo, schoolInfo.id);
                                        }

                                        if (e.target.className === "fa fa-pencil" || e.target.className === "btn btn-primary btn-sm") {
                                            this.props.findContactFlow(user, rowInfo.original.id);
                                        }
                                    }
                                }
                            } else {
                                return {}
                            }
    
                        }}
                        // columns={contactsColumns}
                        columns={[
                            {
                                Header: "Status",
                                accessor: "",
                                width: 80, 
                                headerClassName: 'text-center',
                                sortable: false,
                                Cell: (element) => (
                                    !element.value.deleted_at ?
                                    <div><span className="alert-success grid-record-status">Ativo</span></div>
                                    :
                                    <div><span className="alert-danger grid-record-status">Inativo</span></div>
                                )
                            },
                            {
                                Header: "Ações", accessor: "", sortable: false, width: 80, headerClassName: 'text-center', Cell: (element) => (
                                    !element.value.deleted_at ?
                                        <div className="acoes">
                                            <button className='btn btn-primary btn-sm' disabled={collapse}
                                                onClick={(element) => {
                                                }
                                            }>
                                                <i className='fa fa-pencil'></i>
                                            </button>
                                            <button className='btn btn-danger btn-sm' 
                                                disabled={collapse}
                                            >
                                                <i className='fa fa-ban'></i>
                                            </button>
                                        </div>
                                        :
                                        <div>
                                            <button className='btn btn-success btn-sm' disabled={collapse}>
                                                <i className='fa fa-check-circle'></i>
                                            </button>
                                        </div>
                        
                                )
                            },
                            { Header: "Nome", accessor: "name", headerClassName: 'text-left'},
                            { Header: "Cargo", accessor: "job_title.name", headerClassName: 'text-left' },
                            { Header: "E-mail", accessor: "email", headerClassName: 'text-left' },
                            {
                                Header: "Telefone",
                                id: "phone",
                                width: 380,
                                accessor: d => {
                                    let phones = "";
                                    if (d.phones !== undefined) {
                                        d.phones.forEach(element => {
                                            let type_text = "";
                                            if (element.phone_type == "work") {
                                                type_text = "Trabalho";
                                            } else if (element.phone_type == "home") {
                                                type_text = "Casa";
                                            } else if (element.phone_type == "mobile") {
                                                type_text = "Celular";
                                            } else {
                                                type_text = "Fax";
                                            }
                                            let item_phone = `${element.phone_number} (${type_text})`;
                                            phones = phones + item_phone + ", ";
                                        });
                                        phones = phones.trim();
                                        phones = phones.substring(0, phones.length - 1);
                                    }
                                    
                                    return phones;
                                }
                            }
                        ]}
                        data={contactsList}
                        // loading={loading}
                        defaultPageSize={5}
                        loadingText='Carregando...'
                        noDataText='Sem registros'
                        ofText='de'
                        rowsText=''
                        className='-striped -highlight'
                    />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    contact : state.contact,
    user: state.user,
    school: state.schools,
    levels: state.levels,
    job_title: state.job_titles
});

const functions_object = {
    loadContactsFlow,
    onDeleteContactDataFlow,
    onActiveContactDataFlow,
    addContactFlow,
    findContactFlow,
    levelRequest,
    job_titleLoad, 
    unloadJobTitle
}

export default connect(mapStateToProps, functions_object )(SchoolConctactList);