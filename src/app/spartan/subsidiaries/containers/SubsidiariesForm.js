import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Router } from 'react-router'

import { BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components'

import axios from '../../common/axiosSpartan';

import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import '../../css/site.css';

const apiPost = 'subsidiary';


export default class SubsidiariesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subsidiaries:[],
            internal_code: '',
            internal_name: '',
            back_error: '',
            submitButtonDisabled: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm   = this.submitForm.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/login";
        }

        if (this.props.params.id !== undefined) {
            axios.get(`${apiPost}/${this.props.params.id}`)
            .then(response => {
                const dados = response.data.data;
                this.setState({internal_code: dados.code});
                this.setState({internal_name: dados.name});
                                            })
            .catch(err => console.log(err));
        }
    }

    handleChange(e) {
        const target = e.currentTarget;
    
        this.form.validateFields(target);
    
        this.setState({
          [target.name]: target.value,
          submitButtonDisabled: !this.form.isValid()
        });

    }

    submitForm(event) {
        event.preventDefault();
        axios.post(`${apiPost}`, {
            'code': this.state.internal_code.toUpperCase(),
            'name': this.state.internal_name
                    }).then(res => {
            window.location.href = "#/subsidiaries";
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({back_error: data_error[filterId]});
        }.bind(this));
    }

    updateForm(event) {
        event.preventDefault();
        var id = this.props.params.id;
        axios.put(`${apiPost}/${id}`, {
            'code': this.state.internal_code.toUpperCase(),
            'name': this.state.internal_name
                    }).then(res => {
            window.location.href = "#/subsidiaries";
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error).toString();
            this.setState({back_error: data_error[filterId]});
        }.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();
    
        this.form.validateFields();
    
        this.setState({ submitButtonDisabled: !this.form.isValid() });
    
        if (this.form.isValid()) {
            if (this.props.params.id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }
    
    render() {
        return ( 
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Cadastros', 'Filiais']} icon="fa fa-fw fa-suitcase"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4" />
                </div>

                <WidgetGrid>

                {this.state.back_error !== '' &&
                    <h4 class="alert alert-danger"> {this.state.back_error} </h4>
                }

                    <div className="row">
                        <article className="col-sm-12">

                            <JarvisWidget editbutton={false} color="darken" deletebutton={false} colorbutton={false} >
                                <header>
                                    <span className="widget-icon"> <i className="fa fa-table" /> </span> 
                                    <h2>Cadastrar Filial</h2>
                                </header>
                                <div>
                                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                                        onSubmit={this.handleSubmit} noValidate>

                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <FormGroup for="internal_code">
                                                <FormControlLabel htmlFor="internal_code">Código</FormControlLabel>
                                                <FormControlInput type="text" id="internal_code" name="internal_code"
                                                                    value={this.state.internal_code} onChange={this.handleChange}
                                                                    required />
                                                <FieldFeedbacks for="internal_code">
                                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <FormGroup for="internal_name">
                                                <FormControlLabel htmlFor="internal_name">Nome</FormControlLabel>
                                                <FormControlInput type="text" id="internal_name" name="internal_name"
                                                                    value={this.state.internal_name} onChange={this.handleChange}
                                                                    required  />
                                                <FieldFeedbacks for="internal_name">
                                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>                                        

                                        <button className="btn btn-primary">Salvar</button>
                                        <button className="btn btn-danger" onClick={() => window.location.href = "#/subsidiaries"}>Cancelar</button>
                                    </FormWithConstraints>
                                </div>
                            </JarvisWidget>  

                        </article>
                    </div>
                </WidgetGrid>

            </div>
        )
    }
}