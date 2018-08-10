import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import { canUser } from '../../common/Permissions';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { localizationCreate, localizationUpdate, localizationLoad } from '../../../actions/localization';

const apiPost = 'localization';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

class LocalizationTypeForm extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        localizations: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_localization: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
            })
        }).isRequired,
        localizationUpdate: PropTypes.func.isRequired,
        localizationCreate: PropTypes.func.isRequired,
        localizationLoad: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }

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
        const { localizationLoad, user } = this.props
        this.checkPermission('localization.insert')

        this.props.localizations.current_localization = null;        

        if (this.props.match.params.id !== undefined) {
            this.checkPermission('localization.update')
            localizationLoad(user, this.props.match.params.id)
        }
        
    }

    renderInput = ({ input, type, meta: { touched, error } }) => (
        <div>
            <input
                className="form-control"
                {...input}
                type={type}
            />
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )


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

    submit = (localization) => {
        const { user, localizationCreate, localizationUpdate, reset } = this.props

        if (this.props.match.params.id !== undefined) {
            localizationUpdate(user, localization)
        } else {
            localizationCreate(user, localization)
        }

        reset()
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
        const {
            handleSubmit,
            invalid,
            localizations: {
                list,
                requesting,
                successful,
                messages,
                errors,
                current_localization
            },
        } = this.props
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
                    <form onSubmit={handleSubmit(this.submit)}>
                        <div className="form-group">
                            <label htmlFor="name">Nome do tipo de localização</label>
                            <Field
                                name="name"
                                id="name"
                                component={this.renderInput}
                                validate={fieldRequired}
                                placeholder="Nome"
                            />
                        </div>
                    {statusField}     
                    <button className="btn btn-primary" action="submit" disabled={this.state.submitButtonDisabled}>Salvar</button>
                    <button type="button" className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>
                </form>
                </CardBody>
            </Card>
        )
    }
}

let InitializeFromStateForm = reduxForm({
    form: 'InitializeFromState',
    enableReinitialize: true
})(LocalizationTypeForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        localizations: state.localizations,
        initialValues: state.localizations.current_localization
    }),
    { localizationLoad, localizationUpdate, localizationCreate }
)(InitializeFromStateForm)

export {InitializeFromStateForm as LocalizationTypeForm}