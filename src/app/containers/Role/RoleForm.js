import React, { Component } from 'react';

import { canUser } from '../../common/Permissions';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { roleCreate, roleUpdate, roleLoad } from '../../../actions/role';
const apiPost = 'role';

// Our validation function for `name` field.
const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

class RoleForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        roles: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_role: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                code: PropTypes.string
            })
        }).isRequired,
        roleUpdate: PropTypes.func.isRequired,
        roleCreate: PropTypes.func.isRequired,
        roleLoad: PropTypes.func.isRequired,
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        const { roleLoad, user } = this.props
        this.checkPermission('role.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('role.update');
            roleLoad(user, this.props.match.params.id)
        }
    }

    handleChange(e) {
        const target = e.currentTarget;

        if (target.type == 'checkbox') {
            this.props.roles.current_role.active = target.checked
        }

        // // this.form.validateFields(target);
        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submitButtonDisabled: !this.form.isValid()
        });
    }

    renderNameInput = ({ input, type, meta: { touched, error } }) => (
        <div className="form-group">
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
            />
            {/*
            If the form has been touched AND is in error, show `error`.
            `error` is the message returned from our validate function above
            which in this case is `Name Required`.
    
            `touched` is a live updating property that RF passes in.  It tracks
            whether or not a field has been "touched" by a user.  This means
            focused at least once.
          */}
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    submit = (role) => {

        const { user, roleCreate, roleUpdate, reset } = this.props
        // call to our roleCreate action.

        if (this.props.match.params.id !== undefined) {
            roleUpdate(user, role)
        } else {
            roleCreate(user, role)
        }

        // reset the form upon submit.
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
            // invalid,
            roles: {
                list,
                requesting,
                successful,
                messages,
                errors,
                current_role
            },
        } = this.props

        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/turnos" />;
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
                {/* {redirect} */}
                <CardBody>

                    {this.state.back_error !== '' &&
                        <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                    }
                    <div className="roles">
                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                        onSubmit={handleSubmit(this.submit)} noValidate>

                            <div className="form-grpup">

                                <label htmlFor="code">
                                    Código da Regra
                                    <span className="text-danger"><strong>*</strong></span>
                                </label>
                                <Field
                                    name="code"
                                    type="text"
                                    id="code"
                                    validate={fieldRequired}
                                    placeholder="code"
                                    component={this.renderNameInput}
                                />


                            </div>


                            <div className="form-group">
                                <label htmlFor="name">
                                    Nome da Regra
                                    <span className="text-danger"><strong>*</strong></span>
                                </label>

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

                        </FormWithConstraints>
                    </div>


                </CardBody>
            </Card>
        )
    }
}

let InitializeFromStateForm = reduxForm({
    form: 'InitializeFromState',
    enableReinitialize: true
})(RoleForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        roles: state.roles,
        initialValues: state.roles.current_role
    }),
    { roleLoad, roleUpdate, roleCreate }
)(InitializeFromStateForm)


export default InitializeFromStateForm