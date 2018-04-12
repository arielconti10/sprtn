import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';
import { formatDateToAmerican, formatDateToBrazilian } from '../../../app/common/DateHelper';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../../custom.css';
import MaskedInput from 'react-maskedinput';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const apis = [
    { stateArray: 'job-title', api: 'job-title' },
    { stateArray: 'state', api: 'state' },
];
const apiPost = 'contact';
const apiCep = 'cep';

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            blockButton: false,

            selectedOption: '',
            rows_table: [],
            contact_id: '',
            job_title: [],
            state: [],
            name: '',
            cpf: '',
            email: '',
            address: '',
            number: '',
            neighborhood: '',
            city: '',
            state_id: '0',
            zip_code: '',
            birthday: '',
            authorize_email: '',
            job_title_id: '0',
            active: true,       
            back_error: '',
            authorize_email: '0',
            submitButtonDisabled: false,
            saved: false
        };
        console.log(this.state.rows_table);
        this.handleChange = this.handleChange.bind(this);
        this.searchCep = this.searchCep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    populateSelectbox() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
                    item.stateArray = item.stateArray.replace("-","_");
                    dados.map(item => {
                        item['value'] = item.id,
                        item['label'] = item.name
                    });
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(err => console.log(err));
        });
    }

    componentWillMount() {
        let field = [];
        field.push({key: 0});
        this.setState({rows_table:field});
    }

    componentWillReceiveProps(nextProps) {
        this.populateSelectbox();
        if (nextProps.contact_find !== this.props.contact_find) {
            this.setState({
                contact_id: nextProps.contact_find.id,
                name: nextProps.contact_find.name,
                cpf: nextProps.contact_find.cpf,
                email: nextProps.contact_find.email,
                address: nextProps.contact_find.address,
                number: nextProps.contact_find.number,
                neighborhood: nextProps.contact_find.neighborhood,
                city: nextProps.contact_find.city,
                state_id: nextProps.contact_find.state_id,
                zip_code: nextProps.contact_find.zip_code,
                birthday: formatDateToBrazilian(nextProps.contact_find.birthday),
                authorize_email: nextProps.contact_find.authorize_email,
                job_title_id: nextProps.contact_find.job_title_id,       
                authorize_email: nextProps.contact_find.authorize_email
            });

            if (nextProps.contact_find.length == 0) {
                this.setState({name:'',
                    email: '',
                    address: '',
                    number: '',
                    neighborhood: '',
                    city: ''
                });
            }
        }
      }

    handleChange(e) {
        const target = e.currentTarget;

        this.form.validateFields(target);
        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submitButtonDisabled: !this.form.isValid()
        });
    }
    
    clearForm() {
        this.setState({
            selectedOption: '',
            job_title: [],
            state: [],
            name: '',
            cpf: '',
            email: '',
            address: '',
            number: '',
            neighborhood: '',
            city: '',
            state_id: '0',
            zip_code: '',
            birthday: '',
            authorize_email: '',
            job_title_id: '0',
            active: true,       
            back_error: '',
            authorize_email: '0',
            submitButtonDisabled: false,
            saved: false
        });
    }

    clearAddress() {
        this.setState({address:''});
        this.setState({neighborhood:''});
        this.setState({city:''});
    }

    searchCep() {
        axios.get(`${apiCep}/${this.state.zip_code}`)
        .then(response => {
            let dados = response.data.data;
            this.setState({address:dados.logradouro});
            this.setState({neighborhood:dados.bairro});
            this.setState({city:dados.localidade});

            if (dados.erro !== undefined) {
                this.setState({ back_error: "CEP nāo encontrado. Verifique!" });
                this.clearAddress();
            } else {
                this.setState({back_error:''});
            }
            
        })
        .catch(err => {
            this.setState({ back_error: "CEP nāo encontrado. Verifique!" });
            this.clearAddress();
        });
    }

    handleChangeSelect = (selectedOption) => {
        // console.log(selectedOption);
        this.setState({ 'job_title_id' : selectedOption.value });
    }

    handleChangeState = (selectedOption) => {
        this.setState({ 'state_id' : selectedOption.value });
    }

    clearForm() {
        this.setState({
            selectedOption: '',
            job_title: [],
            state: [],
            name: '',
            cpf: '',
            email: '',
            address: '',
            number: '',
            neighborhood: '',
            city: '',
            state_id: '0',
            zip_code: '',
            birthday: '',
            authorize_email: '',
            job_title_id: '0',
            active: true,       
            back_error: '',
            authorize_email: '0',
            submitButtonDisabled: false,
            saved: false
        });
    }

    submitForm(event) {
        event.preventDefault();

        axios.post(`${apiPost}`, {
            'school_id': this.props.schoolId,
            'name': this.state.name,
            'email': this.state.email,
            'cpf': this.state.cpf,
            'birthday': formatDateToAmerican(this.state.birthday),
            'job_title_id': this.state.job_title_id,
            'zip_code': this.state.zip_code,
            'address': this.state.address,
            'number': this.state.number,
            'complement': this.state.complement,
            'neighborhood': this.state.neighborhood,
            'city': this.state.city,
            'state_id': this.state.state_id,
            'active': this.state.active,
            'authorize_email': this.state.authorize_email
        }).then(res => {
            this.setState({
                saved: true                   
            })
            this.clearForm();
            this.props.updateTable();
            this.props.toggle();
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({ back_error: data_error[filterId] });
        }.bind(this));
    }

    updateForm(event) {
        event.preventDefault();
        var id = this.state.contact_id;

        axios.put(`${apiPost}/${id}`, {
            'school_id': this.props.schoolId,
            'name': this.state.name,
            'email': this.state.email,
            'cpf': this.state.cpf,
            'birthday': formatDateToAmerican(this.state.birthday),
            'job_title_id': this.state.job_title_id,
            'zip_code': this.state.zip_code,
            'address': this.state.address,
            'number': this.state.number,
            'complement': this.state.complement,
            'neighborhood': this.state.neighborhood,
            'city': this.state.city,
            'state_id': this.state.state_id,
            'active': this.state.active,
            'authorize_email': this.state.authorize_email
        }).then(res => {
            this.setState({
                saved: true                   
            })
            this.clearForm();
            this.props.updateTable();
            this.props.toggle();
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error).toString();
            this.setState({ back_error: data_error[filterId] });
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        this.form.validateFields();
        
        this.setState({ submitButtonDisabled: !this.form.isValid() });

        if (this.form.isValid()) {
            if (this.state.contact_id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    toggle(event) {
        this.props.toggle();
    }

    onClickCancel() {
        this.props.onClickCancel();
    }

    addFormRow() {
        let rows = this.state.rows_table;
        let key = rows.length;
        rows.push({key:key});
        this.setState({rows_table: rows})
    }

    removeFormRow(key) {
        let rows = this.state.rows_table;

        if (key > 0) {
            var rows_table = [...this.state.rows_table];
            // console.log(rows_table);
            rows_table.splice(key, 1);
            console.log(rows_table);
            this.setState({rows_table});

            // rows.splice(key);
            // console.log(rows);
            // this.setState({rows_table:rows});
        }

        /*
            var contacts = [...this.state.contacts];
            contacts.splice(index, 1);
            this.setState({contacts});
        */
    }

    render() {
        // this.setState({name:this.props.contact_find.name});
        // console.log(this.props.contact_find);
        const { selectedOption } = this.state;
        const value = this.state.job_title_id;
        const value_state = this.state.state_id;

        let redirect = null;

        let statusField = null;

        return (
            <div>
                    {this.state.back_error !== '' &&
                        <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                    }
                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                        onSubmit={this.handleSubmit} noValidate>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup for="name">
                                <FormControlLabel htmlFor="name">Nome do contato</FormControlLabel>
                                <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup for="email">
                                <FormControlLabel htmlFor="email">E-mail</FormControlLabel>
                                <FormControlInput type="text" id="email" name="email"
                                    value={this.state.email} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="email">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                    </div>

                     <div className="row">

                        <div className="col-md-4">
                            <FormGroup for="cpf">
                                <FormControlLabel htmlFor="cpf">CPF</FormControlLabel>
                                <MaskedInput mask="111.111.111-11"
                                    name="cpf" id="cpf" onChange={this.handleChange}
                                    value = {this.state.cpf}
                                    className="form-control" 
                                    required/>
                                <FieldFeedbacks for="cpf">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup for="birthday">
                                <FormControlLabel htmlFor="birthday">Aniversário</FormControlLabel>
                                <MaskedInput mask="11/11/1111"
                                    name="birthday" id="birthday" onChange={this.handleChange}
                                    value={this.state.birthday}
                                    className="form-control" 
                                    required/>
                                <FieldFeedbacks for="birthday">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup for="job_title_id">
                                <label>Cargo</label>
                                <Select
                                    name="job_title_id"
                                    value={value}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.job_title}
                                />
                                <FieldFeedbacks for="job_title_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                    </div>

                     <div className="row">

                        <div className="col-md-2">
                            <FormGroup for="zip_code">
                                <FormControlLabel htmlFor="zip_code">CEP</FormControlLabel>
                                <MaskedInput mask="11111-111"
                                    name="zip_code" id="zip_code" onChange={this.handleChange}
                                    value = {this.state.zip_code}
                                    className="form-control" required onBlur={this.searchCep}/>
                                <FieldFeedbacks for="zip_code">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup for="address">
                                <FormControlLabel htmlFor="address">Endereço</FormControlLabel>
                                <FormControlInput type="text" id="address" name="address"
                                    value={this.state.address} onChange={this.handleChange}
                                    required/>
                                <FieldFeedbacks for="address">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-2">
                            <FormGroup for="number">
                                <FormControlLabel htmlFor="number">Número</FormControlLabel>
                                <FormControlInput type="text" id="number" name="number"
                                    value={this.state.number} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="number">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-2">
                            <FormGroup for="complement">
                                <FormControlLabel htmlFor="complement">Complemento</FormControlLabel>
                                <FormControlInput type="text" id="complement" name="complement"
                                    value={this.state.complement} onChange={this.handleChange}
                                    />
                                <FieldFeedbacks for="complement">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                    </div>

                     <div className="row">

                        <div className="col-md-4">
                            <FormGroup for="neighborhood">
                                <FormControlLabel htmlFor="neighborhood">Bairro</FormControlLabel>
                                <FormControlInput type="text" id="neighborhood" name="neighborhood"
                                    value={this.state.neighborhood} onChange={this.handleChange}
                                    required/>
                                <FieldFeedbacks for="neighborhood">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup for="city">
                                <FormControlLabel htmlFor="city">Cidade</FormControlLabel>
                                <FormControlInput type="text" id="city" name="city"
                                    value={this.state.city} onChange={this.handleChange}
                                    required/>
                                <FieldFeedbacks for="city">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup for="state_id">
                                <label>Estado</label>
                                <Select
                                    name="state_id"
                                    value={value_state}
                                    onChange={this.handleChangeState}
                                    options={this.state.state}
                                />
                                <FieldFeedbacks for="state_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                    </div>
                    <fieldset>
                         <legend>Telefones</legend>
                         {
                            this.state.rows_table.map(function(r){
                                return (
                                <div className="row" key={r.key}>
                                    <div className="col-md-4">
                                        Coluna 01
                                        {/* <FormGroup for="phone_type">
                                            <FormControlLabel htmlFor="phone_type">Tipo de Telefone</FormControlLabel>
                                            <FormControlInput type="text" id="phone_type" name="phone_type"
                                                required/>
                                            <FieldFeedbacks for="phone_type">
                                                <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                            </FieldFeedbacks>
                                        </FormGroup> */}
                                    </div>  
                                    <div className="col-md-2">
                                        Coluna 02
                                        {/* <FormGroup for="phone_extension">
                                            <FormControlLabel htmlFor="phone_extension">Extensāo</FormControlLabel>
                                            <FormControlInput type="text" id="phone_extension" name="phone_extension"
                                                required/>
                                            <FieldFeedbacks for="phone_extension">
                                                <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                            </FieldFeedbacks>
                                        </FormGroup> */}
                                    </div>     
                                    <div className="col-md-4">
                                        Coluna 03
                                        {/* <FormGroup for="phone_number">
                                            <FormControlLabel htmlFor="phone_number">Número</FormControlLabel>
                                            <FormControlInput type="text" id="phone_number" name="phone_number"
                                                required/>
                                            <FieldFeedbacks for="phone_number">
                                                <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                            </FieldFeedbacks>
                                        </FormGroup> */}
                                    </div> 
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-primary" onClick={() => this.addFormRow()}>
                                            <i className="fa fa-plus-circle"></i>
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={() => this.removeFormRow(r.key)}>
                                            <i className="fa fa-minus-circle"></i>
                                        </button>
                                    </div>
                                </div>
                                )
                            }, this)
                        }

                     </fieldset>


                     <div className="row">

                        <div className="col-md-12">
                            <div className="form-group form-inline">
                                <label className="" style={{marginRight: "10px"}}>Autoriza E-mail</label>
                                <div className="">
                                    <Label className="switch switch-default switch-pill switch-primary">
                                        <Input type="checkbox" id='authorize_email' name="authorize_email" className="switch-input" onChange={this.handleChange}
                                        checked={this.state.authorize_email == 1?'checked':''} />
                                        <span className="switch-label"></span>
                                        <span className="switch-handle"></span>
                                    </Label>
                                </div>                                
                            </div>
                        </div>    
                        {statusField}     
                    </div>

                        <button className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                        <button type="button" className='btn btn-danger' onClick={() => this.onClickCancel()}>
                            Cancelar
                        </button>
                    </FormWithConstraints>
                    
            </div>
        )
    }
}

export default ContactForm;