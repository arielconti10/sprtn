import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import { canUser } from '../../common/Permissions';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { ruleCreate, ruleUpdate, ruleLoad, unloadRule } from '../../../actions/rule';

const apiPost = 'rule';
const apis = [
    { stateArray: 'roles', api: 'role' }
];
const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

class RuleForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        rules: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_rule: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                code: PropTypes.string
            })
        }).isRequired,
        ruleUpdate: PropTypes.func.isRequired,
        ruleCreate: PropTypes.func.isRequired,
        ruleLoad: PropTypes.func.isRequired,
        unloadRule: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            role_array: [],
            name: '',
            code: '',
            active: true,       
            back_error: '',
            submitButtonDisabled: false,
            saved: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findRoles = this.findRoles.bind(this);
    }

    handleSelectChange = (selectedOption) => {
        this.setState({ valid_select_role_array: 1, submit_button_disabled: false });

        const final_array = [];
        const roles_id = selectedOption.map(function (item) {
            const role_object = {role_id : item.id};
            final_array.push(role_object);
            return item.id;
        });

        this.setState({ role_array: roles_id });
    }

    findAll() {
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

    findRoles() {

        if(this.props.rules.current_rule){
            if (this.props.match.params.id !== undefined) {
                this.setState({
                    role_array: this.props.rules.current_rule.roles, //regras selecionadas
                });           
            }

        }
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        const { ruleLoad, user } = this.props
        this.checkPermission('rule.insert');
        this.props.unloadRule();
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('rule.update');
            ruleLoad(user, this.props.match.params.id)
        }
    }

    componentDidMount() {
        
        this.checkPermission('rule.insert');
        const { ruleLoad, user } = this.props
        
        this.props.rules.current_rule = null;

        if (this.props.match.params.id !== undefined) {
            this.checkPermission('rule.update')
            ruleLoad(user, this.props.match.params.id)
            this.findAll();            
        } else {
            this.props.rules.current_rule = null;       
            this.findAll();
        }
    }

    componentDidUpdate(previousProps, previousState){
        if (this.props.match.params.id !== undefined) {
            if(previousProps && previousProps.rules.current_rule){
                if(previousState.role_array && previousState.role_array.length == 0){
                    if(previousState.role_array != previousProps.rules.current_rule.roles){
                        this.findRoles()
                    }
                }
            }
        } else {
            // console.log(previousProps, previousState)
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

    submit = (rule) => {

        const { user, ruleCreate, ruleUpdate, reset } = this.props
        // call to our ruleCreate action.

        rule.roles = this.state.role_array; 

        if (this.props.match.params.id !== undefined) {
            ruleUpdate(user, rule)
        } else {
            ruleCreate(user, rule)
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
            rules: {
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
                    <div className="rules">
                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                        onSubmit={handleSubmit(this.submit)} noValidate>

                            <div className="form-grpup">

                                <label htmlFor="code">
                                    Código da Permissāo
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
                                    Nome da Permissāo
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

                            <div className="form-group col-md-12">
                                <label>Regras<span className="text-danger"><strong>*</strong></span></label>
                                <Select
                                    name="role_array"
                                    id="role_array"
                                    disabled={this.state.viewMode}
                                    value={ this.state.role_array }
                                    labelKey="name"
                                    valueKey="id"
                                    multi={true}
                                    onChange={this.handleSelectChange}
                                    options={this.state.roles}
                                    placeholder="Selecione..."
                                />
                                {this.state.valid_select_role_array == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
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
})(RuleForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        rules: state.rules,
        initialValues: state.rules.current_rule
    }),
    { ruleLoad, ruleUpdate, ruleCreate, unloadRule }
)(InitializeFromStateForm)


export default InitializeFromStateForm