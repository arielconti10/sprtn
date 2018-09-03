import React, { Component } from 'react'
import axios from '../../../app/common/axios';
import { Link } from 'react-router-dom';
import { Collapse, Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import ContactForm from '../Contact/ContactForm';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import SchoolForm from './SchoolForm';

const apiSpartan = 'contact';

import { canUser } from '../../common/Permissions';
import GridApi from '../../common/GridApi';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    loadContactsFlow, onDeleteContactDataFlow, onActiveContactDataFlow,
    addContactFlow, findContactFlow
} from '../../../actions/contact'

class SchoolConctactList extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadContactsFlow: PropTypes.func,
        onDeleteContactDataFlow: PropTypes.func,
        onActiveContactDataFlow: PropTypes.func,
        addContactFlow: PropTypes.func,
        findContactFlow: PropTypes.func,
        contact: PropTypes.shape({
        }),
    }
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.addContact = this.addContact.bind(this);
    }

    toggle() {
    }

    addContact() {
        const contact = this.props.contact;
        const collapse = contact.collapse;
        this.props.addContactFlow(collapse);
    }

    componentWillReceiveProps(nextProps) {
        const user = this.props.user;
        const contactProp = this.props.contact;
        const contacts = this.props.contacts;

        if (contacts !== nextProps.contacts || contactProp.collapse !== nextProps.contact.collapse
            && nextProps.contact.contactsList.length === 0
        ) {
            const nextContacts = nextProps.contacts;
            const collapse = nextProps.contact.collapse;
            this.props.loadContactsFlow(user, nextContacts, collapse);
        }
    }

    render() {
        const { contactsList, collapse } = this.props.contact;
        const { user } = this.props;
        const { schoolInfo } = this.props.school;

        return (
            <div>
                <div className="contact-action">
                    <Collapse isOpen={collapse}>
                        <Card>
                            <CardBody>
                                <ContactForm 
                                    schoolId={schoolInfo.id}
                                    addContact={this.addContact}
                                    // updateTable={this.updateTable.bind(this)} toggle={this.toggle.bind(this)}
                                    // onClickCancel={this.onClickCancel.bind(this)} 
                                    // viewMode={this.state.viewMode} 
                                />
                            </CardBody>
                        </Card>
                    </Collapse>

                    <button className='btn btn-primary' onClick={this.addContact}>
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

const mapStateToProps =(state) => ({
    contact : state.contact,
    user: state.user,
    school: state.schools
});

const functions_object = {
    loadContactsFlow,
    onDeleteContactDataFlow,
    onActiveContactDataFlow,
    addContactFlow,
    findContactFlow
}

export default connect(mapStateToProps, functions_object )(SchoolConctactList);