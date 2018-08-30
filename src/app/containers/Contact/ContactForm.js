import React, { Component } from 'react';

import { formatDateToAmerican, formatDateToBrazilian } from '../../../app/common/DateHelper';

import { Label, Input } from 'reactstrap';

import 'react-datepicker/dist/react-datepicker.css';
import '../../custom.css';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { 
    addContactFlow, loadContactInitialFlow, selectJobFlow, selectStateFlow,
    searchCepFlow, updateAuthEmailFlow, updateFavoriteFlow,
    unloadContact, contactCreateFlow, contactUpdateFlow
} from '../../../actions/contact'

import { createTextMask } from 'redux-form-input-masks';

import { canUser } from '../../common/Permissions';
import { validateCPF, validateEmail, validateDate, validateZipCode } from '../../common/ValidatorHelper';
import PhoneForm from './PhoneForm';

// Our validation function for `name` field.
const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório');

const validate = values => {
    const errors = {};
    
    if (values.email) {
        if (validateEmail(values.email)) {
            errors.email = 'E-mail inválido';
        }
    }

    if (values.cpf) {
        if (!validateCPF(values.cpf)) {
            errors.cpf = "CPF inválido";
        }
    }

    if (values.birthday) {
        if (!validateDate(values.birthday)) {
            errors.birthday = "Data inválida";
        }
    }

    if (values.zip_code) {
        if (!validateZipCode(values.zip_code)) {
            errors.zip_code = "Deve ter 8 caracteres";
        } else {
            if (!values.number) {
                errors.number = "Este campo é de preenchimento obrigatório";
            }
        }
    }
    
    return errors;
}

const cepMask = createTextMask({
    pattern: '99999-999',
    stripMask: false
});

const cpfMask = createTextMask({
    pattern: '999.999.999-99'
});

const birthdayMask = createTextMask({
    pattern: '99/99/9999',
    stripMask: false
});

class ContactForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        addContactFlow: PropTypes.func.isRequired,
        loadContactInitialFlow: PropTypes.func.isRequired,
        selectJobFlow: PropTypes.func.isRequired,
        searchCepFlow: PropTypes.func.isRequired,
        updateAuthEmailFlow: PropTypes.func.isRequired,
        updateFavoriteFlow: PropTypes.func.isRequired,
        unloadContact: PropTypes.func.isRequired,
        contactCreateFlow: PropTypes.func.isRequired,
        contactUpdateFlow: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        contact: PropTypes.shape({
            // username: PropTypes.string.isRequired,
            // access_token: PropTypes.string.isRequired,
        }),
    }

    constructor(props) {
        super(props);
        this.state = {
            invalid_job: false
        };
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeSelectState = this.handleChangeSelectState.bind(this);
        this.addContact = this.addContact.bind(this);
        this.searchCep = this.searchCep.bind(this);
        this.handleChangeAuthEmail = this.handleChangeAuthEmail.bind(this);
        this.handleChangeFavorite = this.handleChangeFavorite.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    addContact() {
        const contact = this.props.contact;
        const collapse = contact.collapse;
        this.props.addContactFlow(collapse);
    }

    resetForm() {
        const { user, reset } = this.props;
        reset();
        this.props.unloadContact();
    }

    submit = (contact) => {
        const { user, reset } = this.props
        const contactObject = this.props.contact; 
        const jobTitleId = contactObject.jobTitleId;
        const contactList = contactObject.contactsList;
        const schoolId = this.props.schoolId;
        const phoneData = contactObject.phoneData;

        if (!jobTitleId) {
            this.setState({invalid_job: true});
            return false;
        }

        contact.job_title_id = jobTitleId.value;
        contact.favorite = contactObject.favorite;
        contact.authorize_email = contactObject.authorizeEmail;
        if (contactObject.stateId) {
            contact.state_id = contactObject.stateId.value;
        }
        
        contact.school_id = schoolId;
        contact.birthday = formatDateToAmerican(contact.birthday);

        if (contactObject.contactInfo.id) { 
            const contactId = contactObject.contactInfo.id;
            contact.active = 1;
            this.props.contactUpdateFlow(user, contact, contactList, contactId, phoneData);
        } else {
            this.props.contactCreateFlow(user, contact, contactList, phoneData);
            this.resetForm();
        }

        this.resetForm();
    }

    handleChangeSelect(selectedOption) {
        const user = this.props.user;
        this.props.selectJobFlow(user, selectedOption);
    }

    handleChangeSelectState(selectedOption) {
        const user = this.props.user;
        this.props.selectStateFlow(selectedOption);
    }

    handleChangeAuthEmail(event) {
        const flag = event.target.checked;
        this.props.updateAuthEmailFlow(flag);
    }

    handleChangeFavorite(event) {
        const flag = event.target.checked;
        this.props.updateFavoriteFlow(flag);
    }

    searchCep(element) {
        const user = this.props.user;
        const cepValue = element.target.value;
        this.props.searchCepFlow(user, cepValue);
    }

    componentWillMount() {
        const user = this.props.user;
        this.props.unloadContact();
        this.props.loadContactInitialFlow(user);
    }

    renderNameInput = ({ input, type, disabled, valueOption ,meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
                disabled={disabled}
                // value={valueOption}
            />
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderCustomInput = ({ input, type, disabled, valueOption ,meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
                disabled={disabled}
                value={valueOption}
            />
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderSelectInput = ({ input, name, valueOption, options, labelKey, valueKey, onChangeFunction ,meta: { touched, error } }) => (
        <div className="form-group group-select">
            <Select
                {...input}
                name={name}
                id={name}
                // disabled={this.state.viewMode}
                value={valueOption}
                onChange={onChangeFunction}
                options={options}
                placeholder="Selecione..."
                labelKey={labelKey}
                valueKey={valueKey}
                onBlur={() => input.onBlur(input.value)}
            />

            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    addContact() {
        this.props.unloadContact();
        const contact = this.props.contact;
        const collapse = contact.collapse;
        this.props.addContactFlow(collapse);
    }

    render() {
        const {
            handleSubmit,
        } = this.props;

        const { jobTitles, jobTitleId, states, stateId, contactError, authorizeEmail,
            favorite, contactAddress, contactInfo 
        } = this.props.contact;

        return (
            <div>
                {contactError && contactError !== '' &&
                    <h4 className="alert alert-danger"> {contactError} </h4>
                }
                <form onSubmit={handleSubmit(this.submit)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="name">
                                    Nome do contato
                                    <span className="text-danger"><strong>*</strong></span>
                                </label>
                                <Field
                                    name="name"
                                    id="name"
                                    component={this.renderNameInput}
                                    validate={fieldRequired}
                                    placeholder="Nome do contato"
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label>Cargo</label>
                            <span className="text-danger">*</span>
                            <Field
                                name="job_title_id"
                                options={jobTitles}
                                onChangeFunction={this.handleChangeSelect}
                                placeholder="Selecione..."
                                valueOption={jobTitleId}
                                component={this.renderSelectInput}
                            />
                            { this.state.invalid_job && 
                                <div style={{ color: 'red'}}>Este campo é de preenchimento obrigatório</div>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="email">
                                    E-mail
                                </label>
                                <Field
                                    name="email"
                                    id="email"
                                    component={this.renderNameInput}
                                    placeholder="E-mail"
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="cpf">
                                    CPF
                                </label>
                                <Field
                                    name="cpf"
                                    id="cpf"
                                    component={this.renderNameInput}
                                    placeholder="CPF"
                                    {...cpfMask}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="birthday">
                                    Aniversário
                                </label>
                                <Field
                                    name="birthday"
                                    id="birthday"
                                    component={this.renderNameInput}
                                    placeholder="Aniversário"
                                    {...birthdayMask}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="zip_code">
                                    CEP
                                </label>
                                <Field
                                    name="zip_code"
                                    id="zip_code"
                                    component={this.renderNameInput}
                                    placeholder="CEP"
                                    onBlur={this.searchCep}
                                    {...cepMask}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="address">
                                Endereço
                            </label>
                            <Field
                                name="address"
                                id="address"
                                component={this.renderCustomInput}
                                placeholder="Endereço"
                                valueOption={contactAddress.address?contactAddress.address:''}
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor="number">
                                Número
                            </label>
                            <Field
                                name="number"
                                id="number"
                                component={this.renderNameInput}
                                placeholder="CEP"
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor="complement">
                                Complemento
                            </label>
                            <Field
                                name="complement"
                                id="complement"
                                component={this.renderNameInput}
                                placeholder="Complemento"
                            />
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-md-4">
                            <label htmlFor="neighborhood">
                                Bairro
                            </label>
                            <Field
                                name="neighborhood"
                                id="neighborhood"
                                component={this.renderCustomInput}
                                placeholder="Bairro"
                                valueOption={contactAddress.neighborhood?contactAddress.neighborhood:''}
                            />
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="city">
                                Cidade
                            </label>
                            <Field
                                name="city"
                                id="city"
                                component={this.renderCustomInput}
                                placeholder="Cidade"
                                valueOption={contactAddress.city?contactAddress.city:''}
                            />
                        </div>

                        <div className="col-md-4">
                            <label>Estado</label>
                            <Field
                                name="state_id"
                                id="state_id"
                                options={states}
                                onChangeFunction={this.handleChangeSelectState}
                                placeholder="Selecione..."
                                valueOption={stateId}
                                component={this.renderSelectInput}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-inline">
                                <label className="" style={{marginRight: "10px"}}>Autoriza E-mail</label>
                                <div className="">
                                    <Label className="switch switch-default switch-pill switch-primary">
                                        <Input type="checkbox" id='authorize_email' name="authorize_email" className="switch-input" 
                                        onChange={this.handleChangeAuthEmail}
                                        checked={authorizeEmail == true?'checked':''} />
                                        <span className="switch-label"></span>
                                        <span className="switch-handle"></span>
                                    </Label>
                                </div>                                
                            </div>
                        </div>    

                        <div className="col-md-6">
                            <div className="form-group form-inline">
                                <label className="" style={{marginRight: "10px"}}>Contato Decisor</label>
                                <div className="">
                                    <Label className="switch switch-default switch-pill switch-primary">
                                        <Input type="checkbox" id='favorite' name="favorite" className="switch-input" 
                                            onChange={this.handleChangeFavorite}
                                            checked={favorite == true?'checked':''}  
                                        />
                                        <span className="switch-label"></span>
                                        <span className="switch-handle"></span>
                                    </Label>
                                </div>                                
                            </div>
                        </div>                           
                    </div>

                    <PhoneForm phonesData={contactInfo.phones}/>
                    
                    <button className="btn btn-primary">Salvar</button>
                    <button type="button" className='btn btn-danger' onClick={this.addContact}>
                        Cancelar
                    </button>
                </form>

            </div>
        )
    }
}

let InitializeFromStateForm = reduxForm({
    form: 'InitializeFromState',
    enableReinitialize: true,
    validate
})(ContactForm)

const functions_object = {
    addContactFlow,
    loadContactInitialFlow,
    selectJobFlow,
    selectStateFlow,
    searchCepFlow,
    updateAuthEmailFlow,
    updateFavoriteFlow,
    unloadContact,
    contactCreateFlow,
    contactUpdateFlow
};

InitializeFromStateForm = connect(
    state => ({
        contact : state.contact,
        user: state.user,
        initialValues: state.contact.contactInfo
    }),
    functions_object
)(InitializeFromStateForm)


export default InitializeFromStateForm