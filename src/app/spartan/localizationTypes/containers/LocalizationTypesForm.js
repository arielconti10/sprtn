import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Router } from 'react-router'

import ContentHeader from '../../../template/components/content/contentHeader'
import Content from '../../../template/components/content/content'
import Row from '../../../template/components/common/row'
import Grid from '../../../template/components/common/grid'

import content from '../../../template/components/content/content';

import Datatable from '../../../template/components/tables/Datatable'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../template/components'

import LocalizationTypesList from './LocalizationTypesList'
import InputCustomize from '../../../template/components/content/InputCustomize';
import SelectCustomize from '../../../template/components/content/SelectCustomize';
import axios from '../../common/axiosSpartan';
import PropTypes from 'prop-types';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import '../../css/site.css';

const apiSpartan = 'localization';


export default class LocalizationTypesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            back_error: '',
            submitButtonDisabled: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm   = this.submitForm.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/spartan/login";
        }

        if (this.props.params.id !== undefined) {
            axios.get(`${apiSpartan}/${this.props.params.id}`)
            .then(response => {
                const dados = response.data.data;
                this.setState({name: dados.name});
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
        axios.post(`${apiSpartan}`, {
            'name': this.state.name,
        }).then(res => {
            window.location.href = "#/localization-types";
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({back_error: data_error[filterId]});
        }.bind(this));
    }

    updateForm(event) {
        event.preventDefault();
        var id = this.props.params.id;
        axios.put(`${apiSpartan}/${id}`, {
            'name': this.state.name,
        }).then(res => {
            window.location.href = "#/localization-types";
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
                    <BigBreadcrumbs items={['Cadastros', 'Tipos de Localizaçāo']} icon="fa fa-fw fa-suitcase"
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
                                    <h2>Cadastrar Tipo de Localizaçāo</h2>
                                </header>
                                <div>
                                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                                        onSubmit={this.handleSubmit} noValidate>

                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <FormGroup for="name">
                                                <FormControlLabel htmlFor="name">Nome</FormControlLabel>
                                                <FormControlInput type="text" id="name" name="name"
                                                                    value={this.state.name} onChange={this.handleChange}
                                                                    required />
                                                <FieldFeedbacks for="name">
                                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <button className="btn btn-primary">Salvar</button>
                                        <button className="btn btn-danger" onClick={() => Router.History.back()}>Cancelar</button>
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