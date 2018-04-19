import React, { Component } from 'react'
import axios from '../../../app/common/axios';

import { RingLoader } from 'react-spinners';

import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import MaskedInput from 'react-maskedinput';
import Select from 'react-select';

import 'react-select/dist/react-select.css';
import './School.css'

const apiPost = 'school';

const apis = [
    { stateArray: 'school_types', api: 'school-type' },
    { stateArray: 'subsidiaries', api: 'subsidiary' },
    { stateArray: 'sectors', api: 'sector' },
    { stateArray: 'profiles', api: 'profile' },
    { stateArray: 'congregations', api: 'congregation' },
    { stateArray: 'states', api: 'state' },
    { stateArray: 'chains', api: 'chain' },
    { stateArray: 'localization_types', api: 'localization' }
];

const selectsValidade = [
    { name: 'school_type_id' },
    { name: 'subsidiary_id' },
    { name: 'sector_id'},
    { name: 'state_id'},
    { name: 'localization_type_id'}
];

export default class SchoolRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: this.props.viewMode,
            back_error: '',
            submitButtonDisabled: false,
            saved: false,
            selectedOption: '',
            ringLoad: false,

            id: this.props.schoolId,
            school_types: [],
            school_type_id: '0',
            subsidiaries: [],
            subsidiary_id: '0',
            sectors: [],
            sector_id: '0',
            school_code_totvs: '',
            profiles: [],
            profile_id: '0',
            congregations: [],
            congregation_id: '0',
            name: '',
            trading_name: '',
            cnpj: '',
            mec_inep_code: '',
            zip_code: '',
            address: '',
            number: '',
            neighborhood: '',
            city: '',
            states: [],
            state_id: '0',
            phone: '',
            email: '',
            chains: [],
            chain_id: '0',
            localization_types: [],
            localization_type_id: '0',
            maintainer: '',

            valid_select_school_type_id: 1,
            valid_select_subsidiary_id: 1,
            valid_select_sector_id: 1,
            valid_select_state_id: 1,
            valid_select_localization_type_id: 1
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.handleChangeSector = this.handleChangeSector.bind(this);
        this.handleChangeProfile = this.handleChangeProfile.bind(this);
        this.handleChangeCongregation = this.handleChangeCongregation.bind(this);
        this.handleChangeState = this.handleChangeState.bind(this);
        this.handleChangeChain = this.handleChangeChain.bind(this);
        this.handleChangeLocalization = this.handleChangeLocalization.bind(this);

    }

    componentDidMount() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
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
        this.setState({ ringLoad: true });
        if (this.state.id !== undefined) {
            axios.get(`${apiPost}/${this.state.id}`)
                .then(response => {
                    let dados = response.data.data;

                    this.setState({
                        school_type_id: dados.school_type_id || '0',
                        subsidiary_id: dados.subsidiary_id || '0',
                        sector_id: dados.sector_id || '0',
                        school_code_totvs: dados.school_code_totvs || '',
                        profile_id: dados.profile_id || '0',
                        congregation_id: dados.congregation_id || '0',
                        name: dados.name || '',
                        trading_name: dados.trading_name || '',
                        cnpj: dados.cnpj || '',
                        mec_inep_code: dados.mec_inep_code || '',
                        zip_code: dados.zip_code || '',
                        address: dados.address || '',
                        number: dados.number || '',
                        neighborhood: dados.neighborhood || '',
                        city: dados.city || '',
                        state_id: dados.state_id || '0',
                        phone: dados.phone || '',
                        email: dados.email || '',
                        chain_id: dados.chain_id || '0',
                        localization_type_id: dados.localization_type_id || '0',
                        maintainer: dados.maintainer || '',

                        ringLoad: false
                    });
                })
                .catch(err => console.log(4, err));
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

    submitForm(event) {
        event.preventDefault();
        axios.post(`${apiPost}`, {
            'school_type_id': this.state.school_type_id,
            'subsidiary_id': this.state.subsidiary_id,
            'sector_id': this.state.sector_id,
            'school_code_totvs': this.state.school_code_totvs,
            'profile_id': this.state.profile_id,
            'congregation_id': this.state.congregation_id,
            'name': this.state.name,
            'trading_name': this.state.trading_name,
            'cnpj': this.state.cnpj,
            'mec_inep_code': this.state.mec_inep_code,
            'zip_code': this.state.zip_code,
            'address': this.state.address,
            'number': !this.state.number ? 'S/N' : this.state.number,
            'neighborhood': this.state.neighborhood,
            'city': this.state.city,
            'state_id': this.state.state_id,
            'phone': this.state.phone,
            'email': this.state.email,
            'chain_id': this.state.chain_id,
            'localization_type_id': this.state.localization_type_id,
            'maintainer': this.state.maintainer
        }).then(res => {
            console.log('res', res);
            this.setState({
                saved: true
            });
            alert('Dados salvos com sucesso!');
        }).catch(function (error) {
            console.log('submitForm', error);

            alert(error);
            this.setState({ back_error: error || '' });
        }.bind(this));
    }

    updateForm(event) {

        event.preventDefault();
        var id = this.state.id;

        axios.put(`${apiPost}/${id}`, {
            'school_type_id': this.state.school_type_id,
            'subsidiary_id': this.state.subsidiary_id,
            'sector_id': this.state.sector_id,
            'school_code_totvs': this.state.school_code_totvs,
            'profile_id': this.state.profile_id < 1 ? null : this.state.profile_id,
            'congregation_id': this.state.congregation_id < 1 ? null : this.state.congregation_id,
            'name': this.state.name,
            'trading_name': this.state.trading_name,
            'cnpj': this.state.cnpj,
            'mec_inep_code': this.state.mec_inep_code,
            'zip_code': this.state.zip_code,
            'address': this.state.address,
            'number': !this.state.number ? 'S/N' : this.state.number,
            'neighborhood': this.state.neighborhood,
            'city': this.state.city,
            'state_id': this.state.state_id,
            'phone': this.state.phone,
            'email': this.state.email,
            'chain_id': this.state.chain_id < 1 ? null : this.state.chain_id,
            'localization_type_id': this.state.localization_type_id,
            'maintainer': !this.state.maintainer ? ' ' : this.state.maintainer
        }).then(res => {
            this.setState({
                saved: true
            });
            alert('Dados salvos com sucesso!');
        }).catch(function (error) {
            console.log('updateForm', error);
            
            alert(error);
            this.setState({ back_error: error || '' });
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        this.form.validateFields();

        this.setState({ submitButtonDisabled: !this.form.isValid() });

        // Validate selects
        let stopSubmit = false;
        selectsValidade.map(select => {
            let objState = `valid_select_${select.name}`;
            let objSelect = this.state[select.name];
            
            if (objSelect === undefined || objSelect == 0) {
                this.setState({ [objState]: 0, submit_button_disabled: true });
                stopSubmit = true;
            } else {
                this.setState({ [objState]: 1 });
            }
        });

        if(stopSubmit){
            return;
        }        

        if (this.form.isValid()) {
            if (this.state.id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    handleChangeType = (selectedOption) => {
        this.setState({ valid_select_school_type_id: 1, submit_button_disabled: false });

        const values = this.state;
        values.school_type_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeSubsidiary = (selectedOption) => {
        this.setState({ valid_select_subsidiary_id: 1, submit_button_disabled: false });

        const values = this.state;
        values.subsidiary_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeSector = (selectedOption) => {
        this.setState({ valid_select_sector_id: 1, submit_button_disabled: false });
        
        const values = this.state;
        values.sector_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeProfile = (selectedOption) => {
        const values = this.state;
        values.profile_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeCongregation = (selectedOption) => {
        const values = this.state;
        values.congregation_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeState = (selectedOption) => {
        this.setState({ valid_select_state_id: 1, submit_button_disabled: false });

        const values = this.state;
        values.state_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeChain = (selectedOption) => {
        const values = this.state;
        values.chain_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeLocalization = (selectedOption) => {
        this.setState({ valid_select_localization_type_id: 1, submit_button_disabled: false });

        const values = this.state;
        values.localization_type_id = selectedOption.value;
        this.setState({ values });
    }

    render() {

        let { school_types, subsidiaries, sectors, profiles, congregations, states, chains, localization_types, selectedOption } = this.state

        return (
            <div>
                
                <RingLoader
                    color={'#123abc'}
                    loading={this.state.ringLoad}
                    margin='50px'
                />
                
                {this.state.back_error !== '' &&
                    <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                }
                <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                    onSubmit={this.handleSubmit} noValidate>

                    <Row>
                        <Col md="3">
                            <FormGroup for="school_type_id">
                                <label>Tipo <span className="text-danger"><strong>*</strong></span></label>
                                <Select
                                    name="school_type_id"
                                    id="school_type_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.school_type_id}
                                    onChange={this.handleChangeType}
                                    options={school_types}
                                />
                                {this.state.valid_select_school_type_id == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="subsidiary_id">
                                <label>Filial <span className="text-danger"><strong>*</strong></span></label>
                                <Select
                                    name="subsidiary_id"
                                    id="subsidiary_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.subsidiary_id}
                                    onChange={this.handleChangeSubsidiary}
                                    options={subsidiaries}
                                />
                                {this.state.valid_select_subsidiary_id == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="sector_id">
                                <label>Setor <span className="text-danger"><strong>*</strong></span></label>
                                <Select
                                    name="sector_id"
                                    id="sector_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.sector_id}
                                    onChange={this.handleChangeSector}
                                    options={sectors}
                                />
                                {this.state.valid_select_sector_id == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="school_code_totvs">
                                <FormControlLabel htmlFor="school_code_totvs">Código escola</FormControlLabel>
                                <FormControlInput type="text" id="school_code_totvs" name="school_code_totvs" readOnly={true}
                                    value={this.state.school_code_totvs} />
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="profile_id">
                                <label>Perfil</label>
                                <Select
                                    name="profile_id"
                                    id="profile_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.profile_id}
                                    onChange={this.handleChangeProfile}
                                    options={profiles}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="4">
                            <FormGroup for="congregation_id">
                                <label>Congregação</label>
                                <Select
                                    name="congregation_id"
                                    id="congregation_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.congregation_id}
                                    onChange={this.handleChangeCongregation}
                                    options={congregations}
                                />
                            </FormGroup>
                        </Col>

                        <Col md="5">
                            <FormGroup for="name">
                                <FormControlLabel htmlFor="name">Instituição <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <FormControlInput type="text" id="name" name="name" readOnly={this.state.viewMode}
                                    value={this.state.name} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="trading_name">
                                <FormControlLabel htmlFor="trading_name">Nome fantasia <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <FormControlInput type="text" id="trading_name" name="trading_name" readOnly={this.state.viewMode}
                                    value={this.state.trading_name} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="trading_name">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="3">
                            <FormGroup for="cnpj">
                                <FormControlLabel htmlFor="cnpj">CNPJ <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <MaskedInput className="form-control" mask="11.111.111/1111-11" type="text" id="cnpj" name="cnpj" readOnly={this.state.viewMode}
                                    value={this.state.cnpj} onChange={this.handleChange} required />
                                <FieldFeedbacks for="cnpj">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="mec_inep_code">
                                <FormControlLabel htmlFor="mec_inep_code">Código MEC/INEP <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <MaskedInput className="form-control" mask="11111111" type="text" id="mec_inep_code" name="mec_inep_code" readOnly={this.state.viewMode}
                                    value={this.state.mec_inep_code} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="mec_inep_code">
                                    <FieldFeedback when={value => value.length < 8}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="zip_code">
                                <FormControlLabel htmlFor="zip_code">CEP <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <MaskedInput className="form-control" mask="11111-111" type="text" id="zip_code" name="zip_code" readOnly={this.state.viewMode}
                                    value={this.state.zip_code} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="zip_code">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="phone">
                                <FormControlLabel htmlFor="phone">Telefone <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <MaskedInput className="form-control" mask="(11) 1111-11111" type="text" id="phone" name="phone" readOnly={this.state.viewMode}
                                    value={this.state.phone} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="phone">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="email">
                                <FormControlLabel htmlFor="email">E-mail</FormControlLabel>
                                <FormControlInput type="text" id="email" name="email" readOnly={this.state.viewMode}
                                    value={this.state.email} onChange={this.handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="4">
                            <FormGroup for="address">
                                <FormControlLabel htmlFor="address">Endereço <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <FormControlInput type="text" id="address" name="address" readOnly={this.state.viewMode}
                                    value={this.state.address} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="address">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="1">
                            <FormGroup for="number">
                                <FormControlLabel htmlFor="number">Número</FormControlLabel>
                                <FormControlInput type="text" id="number" name="number" readOnly={this.state.viewMode}
                                    value={this.state.number} onChange={this.handleChange} />
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="neighborhood">
                                <FormControlLabel htmlFor="neighborhood">Bairro <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <FormControlInput type="text" id="neighborhood" name="neighborhood" readOnly={this.state.viewMode}
                                    value={this.state.neighborhood} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="neighborhood">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="4">
                            <FormGroup for="city">
                                <FormControlLabel htmlFor="city">Cidade <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                <FormControlInput type="text" id="city" name="city" readOnly={this.state.viewMode}
                                    value={this.state.city} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="city">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="3">
                            <FormGroup for="state_id">
                                <label>Estado <span className="text-danger"><strong>*</strong></span></label>
                                <Select
                                    name="state_id"
                                    id="state_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.state_id}
                                    onChange={this.handleChangeState}
                                    options={states}
                                />
                                {this.state.valid_select_state_id == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="chain_id">
                                <label>Tipo de rede</label>
                                <Select
                                    name="chain_id"
                                    id="chain_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.chain_id}
                                    onChange={this.handleChangeChain}
                                    options={chains}
                                />
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="localization_type_id">
                                <label>Tipo de localização <span className="text-danger"><strong>*</strong></span></label>
                                <Select
                                    name="localization_type_id"
                                    id="localization_type_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.localization_type_id}
                                    onChange={this.handleChangeLocalization}
                                    options={localization_types}
                                />
                                {this.state.valid_select_localization_type_id == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="maintainer">
                                <FormControlLabel htmlFor="maintainer">Mantenedora</FormControlLabel>
                                <FormControlInput type="text" id="maintainer" name="maintainer" readOnly={this.state.viewMode}
                                    value={this.state.maintainer} onChange={this.handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="12" className="pull-right">
                            <button className="btn btn-primary pull-right" disabled={this.state.submitButtonDisabled}>Salvar</button>
                        </Col>
                    </Row>

                </FormWithConstraints>

            </div>
        )
    }
}