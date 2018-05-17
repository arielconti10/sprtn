import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import { canUser } from '../../common/Permissions';

const apiPost = 'localization';

class LocalizationTypeForm extends Component {
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

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
                console.log(this.state.viewMode);
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission('localization.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('localization.update');
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;

                    console.log(dados.deleted_at);
                    this.setState({ 
                        name: dados.name,
                        active: dados.deleted_at === null ? true: false
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
            redirect = <Redirect to="/cadastro/tipos-localizacao" />;
        }

        let statusField = null;
        if (this.props.match.params.id != undefined) {
            statusField =
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{marginRight: "10px"}}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input"  
                                disabled={this.state.viewMode}
                                checked={this.state.active} onChange={this.handleChange}/>
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
                                <FormControlLabel htmlFor="name">Nome do tipo de localização</FormControlLabel>
                                <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                        
                        {statusField}     

                        <button className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                        <button className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>
                    </FormWithConstraints>
                    
                </CardBody>
            </Card>
        )
    }
}

export default LocalizationTypeForm;