import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input, Col, Row } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import Select from 'react-select';

import { canUser } from '../../common/Permissions';

import 'react-select/dist/react-select.css';

const apiPost = 'subsidiary';

const apis = [
    { stateArray: 'sectors', api: 'sector' }
];
const selectsValidade = [
    { name: 'sector_array' }
];

class SubsidiaryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            sector_array: [],
            sectors: [],
            active: true,
            back_error: '',
            submitButtonDisabled: false,
            saved: false,
            valid_select_sector_array: 1
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
        apis.map(item => {
            axios.get(`${item.api}?order[name]=asc`)
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

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission('subsidiary.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('subsidiary.update');
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;
                    console.log('1 - dados:', dados)

                    const sectors = dados.sectors.map(item => item.name);

                    this.setState({
                        name: dados.name,
                        sector_array: sectors,
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
            'code': this.state.name,
            'name': this.state.name,
            'sectors': this.state.sector_array,
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
            'code': this.state.name,
            'name': this.state.name,
            'sectors': this.state.sector_array,
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
            if (this.props.match.params.id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    handleSelectChange = (selectedOption) => {
        this.setState({ valid_select_sector_array: 1, submit_button_disabled: false });

        const sectors_id = selectedOption.map(function (item) {
            return item.id;
        });

        this.setState({ sector_array: sectors_id });
    }

    render() {
        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/filiais" />;
        }

        let statusField = null;
        if (this.props.match.params.id !== undefined) {
            statusField =
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{ marginRight: "10px" }}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input" checked={this.state.active} 
                                disabled={this.state.viewMode}
                                onChange={this.handleChange} />
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
                        <Row>
                            <Col md="3">
                                <div className="">
                                    <FormGroup for="name">
                                        <FormControlLabel htmlFor="name">Nome da filial <span className="text-danger"><strong>*</strong></span></FormControlLabel>
                                        <FormControlInput type="text" id="name" name="name"
                                            value={this.state.name} onChange={this.handleChange}
                                            readOnly={this.state.viewMode}
                                            required />
                                        <FieldFeedbacks for="name">
                                            <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                        </FieldFeedbacks>
                                    </FormGroup>
                                </div>
                            </Col>

                            <Col md="9">
                                <FormGroup for="sector_array">
                                    <label>Setor (es) <span className="text-danger"><strong>*</strong></span></label>
                                    <Select
                                        name="sector_array"
                                        id="sector_array"
                                        disabled={this.state.viewMode}
                                        value={this.state.sector_array}
                                        labelKey="name"
                                        valueKey="id"
                                        multi={true}
                                        onChange={this.handleSelectChange}
                                        options={this.state.sectors}
                                        placeholder="Selecione..."
                                    />
                                    {this.state.valid_select_sector_array == 0 &&
                                        <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                    }
                                </FormGroup>
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

export default SubsidiaryForm;