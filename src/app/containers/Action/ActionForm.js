import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button, Label, Input, Table } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

const apiPost = 'action';

class ActionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            active: true,
            back_error: '',
            submitButtonDisabled: false,
            saved: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentWillMount() {
        if (this.props.match.params.id !== undefined) {
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;

                    console.log(dados.deleted_at);
                    this.setState({
                        name: dados.name,
                        active: dados.deleted_at === null ? true : false
                    });
                })
                .catch(err => console.log(err));
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
            'name': this.state.name,
            'active': this.state.active
        }).then(res => {
            this.setState({
                saved: true
            })
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({ back_error: data_error[filterId] });
        }.bind(this));
    }

    updateForm(event) {
        event.preventDefault();
        var id = this.props.match.params.id;

        let data = {
            'name': this.state.name,
            'active': this.state.active
        }

        axios.put(`${apiPost}/${id}`, {
            'name': this.state.name,
            'active': this.state.active
        }).then(res => {
            this.setState({
                saved: true
            })
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
            if (this.props.match.params.id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    render() {
        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/acoes" />;
        }

        let statusField = null;
        if (this.props.match.params.id != undefined) {
            statusField =
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{ marginRight: "10px" }}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input" checked={this.state.active} onChange={this.handleChange} />
                                <span className="switch-label"></span>
                                <span className="switch-handle"></span>
                            </Label>
                        </div>
                    </div>
                </div>
        }


        return (
            <Card>
                {redirect}

                <CardBody>
                    {this.state.back_error !== '' &&
                        <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                    }
                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                        onSubmit={this.handleSubmit} noValidate>

                        <div className="">
                            <FormGroup for="name">
                                <FormControlLabel htmlFor="name">Nome da ação</FormControlLabel>
                                <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                        <Row>
                            <Col xs="5" sm="5" md="5"> 
                            
                                <FormGroup for="user_id">
                                    <FormControlLabel htmlFor="user_id">Tipo de Visita</FormControlLabel>
                                    <Select
                                        name="user_id"
                                        //onChange={(selectedOption) => {this.handleSelectChange('user_id', selectedOption.id, this.getUserSchool, selectedOption);}}
                                        labelKey="full_name"
                                        valueKey="id"
                                        //value={this.state.user_id}
                                        placeholder="Selecione o consultor"
                                        multi={false}
                                        //options={this.state.users}
                                    />
                                </FormGroup>  
                            </Col>
                            <Col xs="5" sm="5" md="5"> 
                                
                                <FormGroup for="subsidiary_id">
                                    <FormControlLabel htmlFor="subsidiary_id">Tipo de Escola</FormControlLabel>
                                    <Select
                                        name="subsidiary_id"
                                        //onChange={(selectedOption) => {this.handleSelectChange('subsidiary_id', selectedOption.id, this.getSectors, selectedOption);}}
                                        labelKey="code_name"
                                        valueKey="id"
                                        //value={this.state.subsidiary_id}
                                        multi={false}
                                        placeholder="Selecione a filial"
                                        //options={this.state.subsidiaries}
                                    />
                                </FormGroup>  
                            </Col>
                            <Col xs="2" sm="2" md="2"> 
                                
                                <FormGroup for="sector_id">
                                    <FormControlLabel htmlFor="sector_id"></FormControlLabel>
                                    <Button>Adicionar</Button>
                                </FormGroup>  
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" md="12"> 
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>Tipo de Visita</th>
                                            <th>Tipo de Escola</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        {statusField}

                        <button className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                        <button className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>
                    </FormWithConstraints>

                </CardBody>
            </Card>
        )
    }
}

export default ActionForm;