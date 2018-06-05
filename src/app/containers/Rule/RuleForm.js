import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import { canUser } from '../../common/Permissions';

const apiPost = 'rule';

class RuleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            name: '',
            code: '',
            role_id: [],
            active: true,       
            back_error: '',
            submitButtonDisabled: false,
            saved: false,
            roleSelect2Loading: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission('rule.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('rule.update');
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;

                    const role_id = dados.roles.map(function(item) {
                        return item.code !== "super"?item.id:"";
                    });
                    
                    //console.log(dados);
                    this.setState({ 
                        name: dados.name,
                        code: dados.code,
                        active: dados.deleted_at === null ? true: false,
                        role_id: role_id
                    });
                })
                .catch(err => console.log(err));
        }
    }

    componentDidMount() {

        //console.log(this.props)
        axios.get(`role`)
            .then(response => {
                const dados = response.data.data;

                dados.shift();

                this.setState({ roles: dados, roleSelect2Loading: false });
                //this.setState({ job_title_type_id: dados[0].id });
            })
            .catch(err => console.log(err));
    }

    handleChange(e) {
        const target = e.currentTarget;

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submitButtonDisabled: !this.form.isValid()
        });
    }

    handleSelectChange = (selectedOption) => {

        const role_id = selectedOption.map(function(item) {
            return item.id;
        });

        this.setState({ role_id: role_id });
    }

    submitForm(event) {

        event.preventDefault();

        const roles_array = [{ role_id:1 }];

        const roles_id = this.state.role_id.map(function(item) {
            const object = {role_id:item};

            if (item !== "") {
                roles_array.push(object);
            }
        })

        axios.post(`${apiPost}`, {
            'name': this.state.name,
            'code': this.state.code,
            'active': this.state.active,
            'roles': roles_array
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
        const roles_array = [{ role_id:1 }];

        const roles_id = this.state.role_id.map(function(item) {
            const object = {role_id:item};

            if (item !== "") {
                roles_array.push(object);
            }
        })

        axios.put(`${apiPost}/${id}`, {
            'name': this.state.name,
            'code': this.state.code,
            'active': this.state.active,
            'roles': roles_array
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
            redirect = <Redirect to="/config/permissoes" />;
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
                            <FormGroup for="code">
                                <FormControlLabel htmlFor="code">Código</FormControlLabel>
                                <FormControlInput type="text" id="code" name="code"
                                    value={this.state.code} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    required />
                                <FieldFeedbacks for="code">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>

                        <div className="">
                            <FormGroup for="name">
                                <FormControlLabel htmlFor="name">Nome da permissão</FormControlLabel>
                                <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>  

                        <div className="">
                            
                            <FormGroup for="role_id">
                                <FormControlLabel htmlFor="role_id">Regras</FormControlLabel>
                                <Select
                                    name="role_id"
                                    onChange={this.handleSelectChange}
                                    labelKey="name"
                                    valueKey="id"
                                    value={this.state.role_id}
                                    multi={true}
                                    joinValues={false}
                                    disabled={this.state.viewMode}
                                    isLoading={this.state.roleSelect2Loading}
                                    options={this.state.roles}
                                /> 
                                <FieldFeedbacks for="role_id">
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

export default RuleForm;