import React, { Component } from 'react'
import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import './School.css'

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

export default class SchoolRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: this.props.viewMode,
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
            maintainer: ''
        };

        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(err => console.log(err));
        });
    }

    componentWillMount() {
        axios.get(`school/${this.state.id}`)
            .then(response => {
                let dados = response.data.data;

                this.setState({
                    school_type_id: dados.school_type_id,
                    subsidiary_id: dados.subsidiary_id,
                    sector_id: dados.sector_id,
                    school_code_totvs: dados.school_code_totvs,
                    profile_id: dados.profile_id,
                    congregation_id: dados.congregation_id,
                    name: dados.name,
                    trading_name: dados.trading_name,
                    cnpj: dados.cnpj,
                    mec_inep_code: dados.mec_inep_code,
                    zip_code: dados.zip_code,
                    address: dados.address,
                    number: dados.number,
                    neighborhood: dados.neighborhood,
                    city: dados.city,
                    state_id: dados.state_id,
                    phone: dados.phone,
                    email: dados.email,
                    chain_id: dados.chain_id,
                    localization_type_id: dados.localization_type_id,
                    maintainer: dados.maintainer
                });
            })
            .catch(err => console.log(4, err));

    }

    handleChange(e) {
        const target = e.currentTarget;

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value
        });
    }

    handleSubmit() {

    }

    render() {

        let { school_types, subsidiaries, sectors, profiles, congregations, states, chains, localization_types } = this.state

        return (
            <div>

                <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                    onSubmit={this.handleSubmit} noValidate>

                    <Row>
                        <Col md="3">
                            <FormGroup for="school_type_id">
                                <label>Tipo</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="school_type_id" name="school_type_id" value={this.state.school_type_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        school_types.map(item => {
                                            let checked = item.id == school_type_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="school_type_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="subsidiary_id">
                                <label>Filial</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="subsidiary_id" name="subsidiary_id" value={this.state.subsidiary_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        subsidiaries.map(item => {
                                            let checked = item.id == subsidiary_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="subsidiary_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="sector_id">
                                <label>Setor</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="sector_id" name="sector_id" value={this.state.sector_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        sectors.map(item => {
                                            let checked = item.id == sector_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="sector_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="school_code_totvs">
                                <FormControlLabel htmlFor="school_code_totvs">Código escola</FormControlLabel>
                                <FormControlInput type="text" id="school_code_totvs" name="school_code_totvs" readOnly={true}
                                    value={this.state.school_code_totvs} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="school_code_totvs">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="profile_id">
                                <label>Perfil</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="profile_id" name="profile_id" value={this.state.profile_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        profiles.map(item => {
                                            let checked = item.id == profile_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="profile_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="3">
                            <FormGroup for="congregation_id">
                                <label>Congregação</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="congregation_id" name="congregation_id" value={this.state.congregation_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        congregations.map(item => {
                                            let checked = item.id == congregation_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="congregation_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="5">
                            <FormGroup for="name">
                                <FormControlLabel htmlFor="name">Instituição</FormControlLabel>
                                <FormControlInput type="text" id="name" name="name" readOnly={this.state.viewMode}
                                    value={this.state.name} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="4">
                            <FormGroup for="trading_name">
                                <FormControlLabel htmlFor="trading_name">Nome fantasia</FormControlLabel>
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
                                <FormControlLabel htmlFor="cnpj">CNPJ</FormControlLabel>
                                <FormControlInput type="text" id="cnpj" name="cnpj" readOnly={this.state.viewMode}
                                    value={this.state.cnpj} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="cnpj">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="mec_inep_code">
                                <FormControlLabel htmlFor="mec_inep_code">Código MEC/INEP</FormControlLabel>
                                <FormControlInput type="text" id="mec_inep_code" name="mec_inep_code" readOnly={this.state.viewMode}
                                    value={this.state.mec_inep_code} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="mec_inep_code">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="zip_code">
                                <FormControlLabel htmlFor="zip_code">CEP</FormControlLabel>
                                <FormControlInput type="text" id="zip_code" name="zip_code" readOnly={this.state.viewMode}
                                    value={this.state.zip_code} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="zip_code">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="2">
                            <FormGroup for="phone">
                                <FormControlLabel htmlFor="phone">Telefone</FormControlLabel>
                                <FormControlInput type="text" id="phone" name="phone" readOnly={this.state.viewMode}
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
                                    value={this.state.email} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="email">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="4">
                            <FormGroup for="address">
                                <FormControlLabel htmlFor="address">Endereço</FormControlLabel>
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
                                    value={this.state.number} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="number">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="neighborhood">
                                <FormControlLabel htmlFor="neighborhood">Bairro</FormControlLabel>
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
                                <FormControlLabel htmlFor="city">Cidade</FormControlLabel>
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
                                <label>Estado</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="state_id" name="state_id" value={this.state.state_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        states.map(item => {
                                            let checked = item.id == state_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="state_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>                        
                    
                        <Col md="3">
                            <FormGroup for="chain_id">
                                <label>Tipo de rede</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="chain_id" name="chain_id" value={this.state.chain_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        chains.map(item => {
                                            let checked = item.id == chain_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="chain_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="localization_type_id">
                                <label>Tipo de localização</label>
                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                    id="localization_type_id" name="localization_type_id" value={this.state.localization_type_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        localization_types.map(item => {
                                            let checked = item.id == localization_type_id ? "checked" : "";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="localization_type_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup for="maintainer">
                                <FormControlLabel htmlFor="maintainer">Mantenedora</FormControlLabel>
                                <FormControlInput type="text" id="maintainer" name="maintainer" readOnly={this.state.viewMode}
                                    value={this.state.maintainer} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="maintainer">
                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </Col>
                    </Row>

                </FormWithConstraints>

            </div>
        )
    }
}