import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';
import { formatDateToAmerican, formatDateToBrazilian } from '../../../app/common/DateHelper';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input, Row, Col } from 'reactstrap';
import ReactTable from 'react-table';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../../custom.css';
import MaskedInput from 'react-maskedinput';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Editable from 'react-x-editable';

import { canUser } from '../../common/Permissions';

const apis = [
    { stateArray: 'job-title', api: 'job-title' },
    { stateArray: 'state', api: 'state' },
];
const apiPost = 'contact';
const apiCep = 'cep';
const apiStates = 'state';

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewMode: this.props.viewMode,
            collapse: false,
            blockButton: false,
            columns: [],
            page: 1,
            pageSize: 5,

            phones_editable: [],
            selectedOption: '',
            previous_phone: [],
            phones_data: [],
            phones_editable: [],
            phone_type: '',
            phone_extension: '',
            phone_number: '',
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
            phone_type_id: '0',
            active: true,       
            back_error: '',
            authorize_email: '0',
            valid_select: '1',
            favorite: '0',
            submitButtonDisabled: false,
            saved: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.searchCep = this.searchCep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.submitPhone = this.submitPhone.bind(this);
        this.clearFormPhone = this.clearFormPhone.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
        this.renderEditableSelect = this.renderEditableSelect.bind(this);
    }

    clearFormPhone() {
        this.setState({
            phone_type: '',
            phone_extension: '',
            phone_number: ''
        });
    }

    updateWithPhone(phone_array) {
        this.setState({
            phones_data: [],
            columns: this.state.columns
        }, () => this.setState({ phones_data: phone_array }));

        this.clearFormPhone();
    }

    submitPhone(event) {
        event.preventDefault();

        this.setState({back_error: ''});

        let phone_object = {
            id: this.state.phone_number,
            phone_number: this.state.phone_number,
            phone_type: this.state.phone_type,
            phone_extension: this.state.phone_extension
        };

        if (phone_object.phone_extension == "") {
            delete phone_object.phone_extension;
        }

        let phone_array = this.state.phones !== undefined?this.state.phones:[];
        
        if (phone_object.phone_number != "" && phone_object.phone_type != "") {
            phone_object.phone_number = phone_object.phone_number.replace("_","");
            phone_array.push(phone_object);    
            this.setState({phones:phone_array});
            this.updateWithPhone(phone_array);
        } else {
            this.setState({back_error: 'Preencha os campos para adicionar um telefone'});
        }
        
    }

    populateSelectbox() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
                    item.stateArray = item.stateArray.replace("-","_");
                    dados.map(item => {
                        item['value'] = item.id,
                        item['label'] = item.name,
                        item['abbrev'] = item.abbrev
                    });

                    dados.sort(function(a, b) {
                        if (a.name === b.name) {
                            return 0;
                        }
                        else {
                            return (a.name < b.name) ? -1 : 1;
                        }
                    });
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(err => console.log(err));
        });
    }

    onClickDeletePhone(element) {
        const { id } = element.value;
        let resp = confirm("Deseja realmente excluir este registro?");

        if (resp == true) {
            let contacts = this.state.phones.filter(function(item){
                return item.id !== id 
            });

            this.setState({phones_data:contacts});
            this.setState({phones:contacts});
            this.updateWithPhone(contacts);
        }
    }

    renderEditable(cellInfo) {
        try {
            let index = cellInfo.index;
            let column_id = cellInfo.column.id;
            return (
              <div
                // style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                  const data = this.state.phones_data;
                  if (data[index][column_id] != "") {
                     data[index]['old_value'] = data[index][column_id];
                     data[index]['old_field'] = column_id;
                  }
                  
                  data[index][column_id] = e.target.innerHTML;
                  data[index]['from_editable'] = 1;

                  this.setState({ phones_editable : data });
                }}
                dangerouslySetInnerHTML={{
                  __html: this.state.phones_data[index][column_id]
                }}
              />
            );
        } catch (error) {
            console.log(error);
        }
    }

    renderEditableSelect(cellInfo) {
        try {
            let index = this.state.phones_data.findIndex(function(item){
                return cellInfo.target.id == item.id;
            });
            let column_id = cellInfo.target.name;
            let data = this.state.phones_data;

            data[index][column_id] = cellInfo.target.value;

            this.setState({phones_data:data});
            this.setState({phones:data});

            this.createPhoneTable();
        } catch (error) {
            console.log(error);
        }
    }

    createPhoneTable() {
        let col = [
            {
                Header: "Tipo",
                id: "phone_type",
                width: 380,
                accessor: (element) => {
                    return (<select name="phone_type" className="form-control" id={element.id} value={element.phone_type} onChange={this.renderEditableSelect}>
                        <option value="home">Casa</option>
                        <option value="mobile">Celular</option>
                        <option value="fax">Fax</option>
                        <option value="work">Trabalho</option>
                    </select>)
                }
            },
            { 
                Header: "Telefone", 
                id: "phone_number",
                headerClassName: 'text-left',
                accessor: "phone_number",
                Cell: this.renderEditable 
            },
            { 
                Header: "Observaçāo", 
                id: 'phone_extension',
                accessor: "phone_extension", 
                headerClassName: 'text-left',
                Cell: this.renderEditable 
            },
        ];

        col.push(
            {
                Header: "Ações", accessor: "", sortable: false, width: 90, headerClassName: 'text-left', Cell: (element) => (
                    !element.value.deleted_at ?
                        <div>
                            <button type="button" className='btn btn-danger btn-sm' onClick={() => this.onClickDeletePhone(element)}>
                                <i className='fa fa-ban'></i>
                            </button>
                        </div>
                        :
                        <div>
                            <button className='btn btn-success btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickActive(element)}>
                                <i className='fa fa-check-circle'></i>
                            </button>
                        </div>

                )
            }
        )

        this.setState({ columns: col });
    }

    componentDidMount() {
        // this.createPhoneTable();
    }

    componentWillReceiveProps(nextProps) {
        this.checkPermission();
        this.populateSelectbox();

        if (nextProps.contact_find !== this.props.contact_find) {
            
            this.setState({
                previous_phone: nextProps.contact_find.phones,
                phones_data :nextProps.contact_find.phones,
                phones: nextProps.contact_find.phones,
                contact_id: nextProps.contact_find.id,
                name: nextProps.contact_find.name,
                cpf: nextProps.contact_find.cpf,
                email: nextProps.contact_find.email !== null?nextProps.contact_find.email:'',
                address: nextProps.contact_find.address !== null?nextProps.contact_find.address:'',
                number: nextProps.contact_find.number !== null?nextProps.contact_find.number:'',
                neighborhood: nextProps.contact_find.neighborhood,
                city: nextProps.contact_find.address !== null?nextProps.contact_find.city:'',
                state_id: nextProps.contact_find.state_id,
                zip_code: nextProps.contact_find.zip_code,
                birthday: formatDateToBrazilian(nextProps.contact_find.birthday),
                authorize_email: nextProps.contact_find.authorize_email,
                job_title_id: nextProps.contact_find.job_title_id,       
                authorize_email: nextProps.contact_find.authorize_email,
                favorite: nextProps.contact_find.favorite
            }, function() {
                this.createPhoneTable();
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
            favorite: '0',
            submitButtonDisabled: false,
            saved: false
        });
    }

    clearAddress() {
        this.setState({address:''});
        this.setState({neighborhood:''});
        this.setState({city:''});
    }

    searchStateWithCep(state_uf) {
        this.state.state.map(item => {
            if (item.abbrev == state_uf) {
                this.setState({state_id:item.id});
            }
        });
    }

    searchCep() {
        axios.get(`${apiCep}/${this.state.zip_code}`)
        .then(response => {
            let dados = response.data.data;

            if (dados.erro !== undefined) {
                this.setState({ back_error: "CEP nāo encontrado. Verifique!" });
                this.clearAddress();
            } else {
                this.setState({address:dados.logradouro});
                this.setState({neighborhood:dados.bairro});
                this.setState({city:dados.localidade});
                this.searchStateWithCep(dados.uf);
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

    handleChangePhone = (selectedOption) => {
        this.setState({ 'phone_type' : selectedOption.value });
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
            'phones': this.state.phones,
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
            'authorize_email': this.state.authorize_email,
            'favorite': this.state.favorite
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

        //caso a extensāo do telefone esteja vazia, excluir, evitando erros na API
        this.state.phones.map(item => {
            if (item.phone_extension == "") {
                delete item.phone_extension;
            }
        });

        axios.put(`${apiPost}/${id}`, {
            'phones': this.state.phones,
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
            'authorize_email': this.state.authorize_email,
            'favorite': this.state.favorite
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

        if (this.state.job_title_id === undefined) {
            this.setState({valid_select:0});
        } else {
            this.setState({valid_select:1});
        }

        if (this.form.isValid() && this.state.job_title_id !== undefined) {
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
        if (this.props.contact_find.phones !== undefined) {
            let contacts = this.props.contact_find.phones.filter(function(item){
                return item.contact_id !== undefined 
            });

            contacts.map(item => {
                if(item.from_editable && item.from_editable == 1) {
                    let old_field = item.old_field;
                    item[old_field] = item.old_value;
                }
            });

            console.log(contacts);

            this.setState({
                phones_data: [],
                columns: this.state.columns
            }, () => this.setState({ phones_data: contacts, phones: contacts }));
        }

        // this.clearForm();
        this.clearFormPhone();

        this.props.toggle();
    }

    checkPermission() {
        canUser('school.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));
    }

    render() {
        const { phones_data, pageSize, page, loading, pages, columns } = this.state;

        const { selectedOption } = this.state;
        const value = this.state.job_title_id;
        const value_state = this.state.state_id;
        const value_phone = this.state.phone_type;

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
                                <FormControlLabel htmlFor="name">
                                    Nome do contato
                                    <span className="text-danger"><strong>*</strong></span>
                                </FormControlLabel>
                                <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    required/>
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup for="job_title_id">
                                <label>Cargo</label>
                                <span className="text-danger">*</span>
                                <Select
                                    name="job_title_id"
                                    value={value}
                                    disabled={this.state.viewMode}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.job_title}
                                />
                                {this.state.valid_select == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </FormGroup>
                        </div>
                    </div>

                     <div className="row">

                        <div className="col-md-4">
                            <FormGroup for="email">
                                <FormControlLabel htmlFor="email">E-mail</FormControlLabel>
                                <FormControlInput type="text" id="email" name="email"
                                    value={this.state.email} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    />
                                <FieldFeedbacks for="email">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup for="cpf">
                                <FormControlLabel htmlFor="cpf">CPF</FormControlLabel>
                                <MaskedInput mask="111.111.111-11"
                                    name="cpf" id="cpf" onChange={this.handleChange}
                                    value = {this.state.cpf}
                                    readOnly={this.state.viewMode}
                                    className="form-control" 
                                    />
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
                                    readOnly={this.state.viewMode}
                                    className="form-control" 
                                    />
                                <FieldFeedbacks for="birthday">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
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
                                    readOnly={this.state.viewMode}
                                    className="form-control" onBlur={this.searchCep}/>
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
                                    readOnly={this.state.viewMode}
                                    />
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
                                    readOnly={this.state.viewMode}
                                     />
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
                                    readOnly={this.state.viewMode}
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
                                    readOnly={this.state.viewMode}
                                    />
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
                                    readOnly={this.state.viewMode}
                                    />
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
                                    disabled={this.state.viewMode}
                                />
                                <FieldFeedbacks for="state_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-inline">
                                <label className="" style={{marginRight: "10px"}}>Autoriza E-mail</label>
                                <div className="">
                                    <Label className="switch switch-default switch-pill switch-primary">
                                        <Input type="checkbox" id='authorize_email' name="authorize_email" className="switch-input" onChange={this.handleChange}
                                        checked={this.state.authorize_email == 1?'checked':''} disabled={this.state.viewMode}/>
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
                                        <Input type="checkbox" id='favorite' name="favorite" className="switch-input" onChange={this.handleChange}
                                        checked={this.state.favorite == 1?'checked':''} disabled={this.state.viewMode} />
                                        <span className="switch-label"></span>
                                        <span className="switch-handle"></span>
                                    </Label>
                                </div>                                
                            </div>
                        </div>  
                         
                        {statusField}     
                    </div>

                    <fieldset>
                         <legend>Telefones</legend>
                         <div className="row">
                            <div className="col-md-4">
                                <FormGroup for="phone_type">
                                    <label>Tipo de Telefone</label>
                                    <Select
                                        name="phone_type"
                                        value={value_phone}
                                        onChange={this.handleChangePhone}
                                        options={[
                                            {label: 'Casa', value: 'home'},
                                            {label: 'Celular', value: 'mobile'},
                                            {label: 'Fax', value: 'fax'},
                                            {label: 'Trabalho', value: 'work'}
                                        ]}
                                        disabled={this.state.viewMode}
                                    />
                                    <FieldFeedbacks for="phone_type">
                                        <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks>
                                    <button type="button" className="btn btn-primary" onClick={this.submitPhone}>Adicionar Telefone</button>
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup for="phone_number">
                                    <FormControlLabel htmlFor="phone_number">Telefone</FormControlLabel>
                                    <MaskedInput className="form-control" mask="(11) 1111-11111" type="text" id="phone_number" name="phone_number" 
                                        value={this.state.phone_number} onChange={this.handleChange} readOnly={this.state.viewMode}
                                    />
                                    <FieldFeedbacks for="phone_number">
                                        <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup for="phone_extension">
                                    <FormControlLabel htmlFor="phone_extension">Observaçāo</FormControlLabel>
                                    <FormControlInput type="text" id="phone_extension" name="phone_extension"
                                        value={this.state.phone_extension} onChange={this.handleChange}
                                        readOnly={this.state.viewMode}
                                        />
                                    <FieldFeedbacks for="phone_extension">
                                        <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>
                                
                            </div>

                            <Row>
                                <Col md="12">
                                    <ReactTable
                                        columns={columns}
                                        data={phones_data}
                                        loading={loading}
                                        defaultPageSize={pageSize}
                                        loadingText='Carregando...'
                                        noDataText='Sem registros'
                                        ofText='de'
                                        rowsText=''
                                        className='-striped -highlight'
                                    />
                                </Col>
                            </Row>
                     </fieldset>

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