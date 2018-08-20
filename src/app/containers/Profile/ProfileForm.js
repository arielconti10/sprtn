import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import { canUser } from '../../common/Permissions';

const apiPost = 'profile';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { profileCreate, profileUpdate, profileLoad, profileCurrentClear } from '../../../actions/profile';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

class ProfileForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        profiles: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_profile: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                code: PropTypes.string,
            })
        }).isRequired,
        profileUpdate: PropTypes.func.isRequired,
        profileCreate: PropTypes.func.isRequired,
        profileLoad: PropTypes.func.isRequired,
        profileCurrentClear: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            code: '',
            active: true,       
            back_error: '',
            submitButtonDisabled: false,
            saved: false
        };

        this.handleChange = this.handleChange.bind(this);
        
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission('profile.insert');
        const { profileLoad, user } = this.props
        
        this.props.profiles.current_profile = null;
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('profile.update')
            profileLoad(user, this.props.match.params.id)
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
        let active = true;
        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,    
        });
        if(target.type == 'checkbox'){
            active = target.checked
            this.props.profiles.current_profile.active = active
        }
    }
    submit = (profile) => {
        const { user, profileCreate, profileUpdate, reset } = this.props
        
        if (this.props.match.params.id !== undefined) {  
            profile.active = this.props.profiles.current_profile.active         
            profileUpdate(user, profile, this.props.profiles.current_profile.active)
        } else {
            profileCreate(user, profile)
        }

        reset()
    }

    render() {
        const {
            handleSubmit,
            invalid,
            profiles: {
                profile,
                requesting,
                successful,
                messages,
                errors,
                current_profile
            },
        } = this.props

        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/perfis" />;
        }

        let statusField = null;
        if (this.props.match.params.id != undefined) {
            statusField =
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
                            <label htmlFor="name">Código do perfil</label>
                            <Field
                                name="code"
                                id="code"
                                component={this.renderInput}
                                validate={fieldRequired}
                                placeholder="Código do perfil"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Nome do perfil</label>
                            <Field
                                name="name"
                                id="name"
                                component={this.renderInput}
                                validate={fieldRequired}
                                placeholder="Nome do perfil"
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
})(ProfileForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        profiles: state.profiles,
        initialValues: state.profiles.current_profile
    }),
    { profileLoad, profileUpdate, profileCreate, profileCurrentClear }
)(InitializeFromStateForm)

export default InitializeFromStateForm