import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';


const apiSelectBox = 'role';
const apiPost = 'user';

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],            
            name: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            password_confirmation: '',
            role_id: '0',  
            superior: '',  
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
        //console.log(this.props.match.params)

        ///console.log
        if (this.props.match.params.id !== undefined) {
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;

                    console.log(dados.deleted_at);
                    this.setState({                         
                        name: dados.name,
                        lastname: dados.lastname, 
                        username: dados.username, 
                        role_id: dados.role_id,
                        email: dados.email,
                        superior: (dados.parent != null ? dados.parent.full_name : ''),
                        active: dados.deleted_at === null ? true: false
                    });
                    //console.log(this.state.role_id);
                })
                .catch(err => console.log(err));
        }
    }

    componentDidMount() {

        //console.log(this.props)
        axios.get(`${apiSelectBox}`)
            .then(response => {
                const dados = response.data.data;
                this.setState({ roles: dados });
                //this.setState({ role_id: dados[0].id });
            })
            .catch(err => console.log(err));
    }

    handleChange(e) {
        const target = e.currentTarget;

        this.form.validateFields(target);

        //console.log(this.form.isValid());

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submitButtonDisabled: !this.form.isValid()
        });

    }

    submitForm(event) {
        event.preventDefault();
        axios.post(`${apiPost}`, {            
            'name': this.state.name,
            'lastname': this.state.lastname,
            'role_id': this.state.role_id,
            'username': this.state.username, 
            'email': this.state.email, 
            'password': this.state.password, 
            'password_confirmation': this.state.password_confirmation, 
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

        let dataUpdate = {
            'lastname': this.state.lastname,
            'name': this.state.name,
            'role_id': this.state.role_id,
            'username': this.state.username,
            'email': this.state.email,             
            'active': this.state.active
        }

        if (this.props.match.params.id != undefined && this.state.password != '') {
            dataUpdate.password = this.state.password, 
            dataUpdate.password_confirmation = this.state.password_confirmation
        }

        //return false;
        axios.put(`${apiPost}/${id}`, dataUpdate).then(res => {
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
        
        //console.log(this.form.isValid());

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
        //console.log(this.props);

        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/config/usuarios" />;
        }

        let statusField = null;
        let validationPassword = null;
        if (this.props.match.params.id != undefined) {
            statusField = (
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{marginRight: "10px"}}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input"  checked={this.state.active} onChange={this.handleChange}/>
                                <span className="switch-label"></span>
                                <span className="switch-handle"></span>
                            </Label>
                        </div>                                
                    </div>
                </div>
            );

            
        }
        else {
            validationPassword = (
                <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
            );
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
                        <div className="row">
                            <div className="col-sm-6">
                                <FormGroup for="name">
                                    <FormControlLabel htmlFor="lastname">Nome</FormControlLabel>
                                    <FormControlInput type="text" id="name" name="name"
                                        value={this.state.name} onChange={this.handleChange}
                                        required />
                                    <FieldFeedbacks for="name">
                                        <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>

                            <div className="col-sm-6">
                                <FormGroup for="lastname">
                                    <FormControlLabel htmlFor="lastname">Sobrenome</FormControlLabel>
                                    <FormControlInput type="text" id="lastname" name="lastname"
                                        value={this.state.lastname} onChange={this.handleChange}
                                        required />
                                    <FieldFeedbacks for="lastname">
                                        <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <FormGroup for="username">
                                    <FormControlLabel htmlFor="username">Usuário de rede</FormControlLabel>
                                    <FormControlInput type="text" id="username" name="username"
                                        value={this.state.username} onChange={this.handleChange}
                                        required />
                                    <FieldFeedbacks for="username">
                                        <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>
                            <div className="col-sm-6">
                                <FormGroup for="email">
                                    <FormControlLabel htmlFor="email">Email</FormControlLabel>
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
                            <div className="col-sm-6">
                                <FormGroup for="password">
                                    <FormControlLabel htmlFor="password">Senha</FormControlLabel>
                                    <FormControlInput type="password" id="password" name="password"
                                        value={this.state.password} onChange={this.handleChange}
                                        required />
                                    <FieldFeedbacks for="password">
                                        {validationPassword}
                                        <FieldFeedback when={value => value !== this.state.password_confirmation && this.state.password_confirmation != ""}>Senhas não conferem</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>
                            <div className="col-sm-6">
                                <FormGroup for="password_confirmation">
                                    <FormControlLabel htmlFor="password_confirmation">Confirmação de Senha</FormControlLabel>
                                    <FormControlInput type="password" id="password_confirmation" name="password_confirmation"
                                        value={this.state.password_confirmation} onChange={this.handleChange}
                                        required />
                                    <FieldFeedbacks for="password_confirmation">
                                        {validationPassword}
                                        <FieldFeedback when={value => value !== this.state.password && this.state.password != ""}>Senhas não conferem</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>
                        </div>

                        <div className="">
                            <FormGroup for="role_id">
                                <label>Tipo de Usuário</label>
                                <select className="form-control" onChange={this.handleChange}
                                    id="role_id" name="role_id" value={this.state.role_id}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        this.state.roles.map(data => {
                                            const checked = data.id == this.state.role_id ? "checked" : "";
                                            return (
                                                <option key={data.id} value={data.id}>
                                                    {data.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <FieldFeedbacks for="role_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>  

                        <div className="">
                            <FormGroup for="superior">
                                <FormControlLabel htmlFor="superior">Superior</FormControlLabel>
                                <FormControlInput type="text" id="superior" name="superior" 
                                    value={this.state.superior} disabled />                                
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

export default UserForm;