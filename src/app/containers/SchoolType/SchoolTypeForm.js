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
import { schoolTypeCreate, schoolTypeUpdate, schoolTypeLoad } from '../../../actions/schoolTypes';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

class SchoolTypeForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        schoolTypes: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_schoolType: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
            })
        }).isRequired,
        schoolTypeUpdate: PropTypes.func.isRequired,
        schoolTypeCreate: PropTypes.func.isRequired,
        schoolTypeLoad: PropTypes.func.isRequired,
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

    componentWillMount() {
        const { schoolTypeLoad, user } = this.props

        this.checkPermission('school-type.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('school-type.update');
            schoolTypeLoad(user, this.props.match.params.id)
        }
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    handleChange(e) {
        const target = e.currentTarget;

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            // submitButtonDisabled: !this.form.isValid()
        });
    }

    renderNameInput = ({ input, type, meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
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
    submit = (schoolType) => {

        const { user, schoolTypeCreate, schoolTypeUpdate, reset } = this.props
        // call to our shiftCreate action.

        if (this.props.match.params.id !== undefined) {
            schoolTypeCreate(user, schoolType)
        } else {
            schoolTypeUpdate(user, schoolType)
        }

        // reset the form upon submit.
        reset()

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
        const {
            handleSubmit,
            invalid,
            schoolTypes: {
                list,
                requesting,
                successful,
                messages,
                errors,
                current_schoolType
            },
        } = this.props

        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/tipos-escola" />;
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
                        <label htmlFor="name">Nome do tipo de escola</label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            component={this.renderNameInput}
                            className="form-control"
                            validate={fieldRequired}
                        />
                    </div>

                    {statusField}

                    <button action="submit" className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
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
})(SchoolTypeForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        schoolTypes: state.schoolTypes,
        initialValues: state.schoolTypes.current_schoolType
    }),
    { schoolTypeLoad, schoolTypeUpdate, schoolTypeCreate }
)(InitializeFromStateForm)


export default InitializeFromStateForm