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
    addContactFlow
} from '../../../actions/contact'

class SchoolConctactList extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadContactsFlow: PropTypes.func,
        onDeleteContactDataFlow: PropTypes.func,
        onActiveContactDataFlow: PropTypes.func,
        addContactFlow: PropTypes.func,
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
        const { contactsList, contactsColumns, collapse } = this.props.contact;
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
                                            (e.target.className === "fa fa-ban" || e.target.tagName === "BUTTON")) {
                                            this.props.onDeleteContactDataFlow(user, apiSpartan, rowInfo, schoolInfo.id);
                                        }
        
                                        if (rowInfo.original.deleted_at && (e.target.className === "fa fa-check-circle" || e.target.tagName === "BUTTON")) {
                                            this.props.onActiveContactDataFlow(user, apiSpartan, rowInfo, schoolInfo.id);
                                        }
                                    }
                                }
                            } else {
                                return {}
                            }
    
                        }}
                        columns={contactsColumns}
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
    addContactFlow
}

export default connect(mapStateToProps, functions_object )(SchoolConctactList);