import React, { Component } from 'react';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { Async } from 'react-select';
import Select from 'react-select';
import { canUser } from '../../common/Permissions';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { userCreate, userUpdate, userLoad, roleListFlow, 
    changeRoleFlow, getSubsidiariesFlow, 
    changeSubsidiaryFlow, 
    changeSectorFlow,
    changeStatusFlow,
    searchByNameFlow,
    userUpdateWithSuperior,
    unloadUser
} from '../../../actions/user';

// Our validation function for `name` field.
const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

const validate = values => {
    const errors = {};

    if (values.password !== values.password_confirmation) {
        errors.password_confirmation = "Senhas nāo conferem";
    }

    if (values.subsidiary_id && !values.sector_id) {
        errors.sector_id = "Este campo é de preenchimento obrigatório";
    }

    return errors;
}

const apiSelectBox = 'role';
const apiPost = 'user';

class UserForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        user: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_user: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                code: PropTypes.string
            })
        }).isRequired,
        userUpdate: PropTypes.func.isRequired,
        userCreate: PropTypes.func.isRequired,
        userLoad: PropTypes.func.isRequired,
        changeRoleFlow: PropTypes.func.isRequired,
        roleListFlow: PropTypes.func.isRequired,
        getSubsidiariesFlow: PropTypes.func.isRequired,
        changeSubsidiaryFlow: PropTypes.func.isRequired,
        changeSectorFlow: PropTypes.func.isRequired,
        changeStatusFlow: PropTypes.func.isRequired,
        searchByNameFlow: PropTypes.func.isRequired,
        userUpdateWithSuperior: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }

    constructor(props) {
        super(props);
        
        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.handleChangeSector = this.handleChangeSector.bind(this);
        this.handleChangeSuperior = this.handleChangeSuperior.bind(this);
        this.getOptions = this.getOptions.bind(this);
    }

    checkPermission(permission){
        canUser(permission, this.props.history, "change", function(rules){
            if(rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true})
            }
        })
    }

    componentWillMount() {
        const { user, reset } = this.props

        this.checkPermission('user.insert');
        this.props.roleListFlow(user);
        this.props.getSubsidiariesFlow(user);
        this.props.unloadUser();

        if (this.props.match.params.id !== undefined) {
            this.checkPermission('user.update');
            this.props.userLoad(user, this.props.match.params.id);
        }
    }

    handleChange(e) {
        const target = e.currentTarget;

        const { userSearch, active } = this.props.user;

        if (target.type == 'checkbox') {
            const new_status = !active;
            this.props.changeStatusFlow(new_status);
        }

    }

    handleChangeRole(selectedOption) {
        this.props.changeRoleFlow(selectedOption);
    }

    handleChangeSubsidiary(selectedOption) {
        const { shiftLoad, user } = this.props
        this.props.changeSubsidiaryFlow(selectedOption, user);
    }

    handleChangeSector(selectedOption) {
        const { shiftLoad, user } = this.props
        this.props.changeSectorFlow(selectedOption, user);
    }

    renderNameInput = ({ input, type, disabled, valueOption ,meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
                disabled={disabled}
            />
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderSelectInput = ({ input, name, valueOption, options, labelKey, valueKey, onChangeFunction ,meta: { touched, error } }) => (
        <div className="form-group">
            <Select
                {...input}
                name={name}
                id={name}
                // disabled={this.state.viewMode}
                value={valueOption}
                onChange={onChangeFunction}
                options={options}
                placeholder="Selecione..."
                labelKey={labelKey}
                valueKey={valueKey}
                onBlur={() => input.onBlur(input.value)}
            />

            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )


    submit = (userObject) => {
        const { user, userCreate, userUpdate, reset } = this.props;

        userObject.subsidiary_id = user.subsidiary_id;
        userObject.sector_id = user.sector_id;
        userObject.role_id = user.role_id;
        userObject.active = user.active;

        if (this.props.match.params.id !== undefined) {
            if (this.state.superior_id) {
                this.props.userUpdateWithSuperior(this.state.superior_id, userObject, user);
            } else {
                userUpdate(userObject, user);
            }
            
        } else {
            userCreate(userObject, user);
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

    searchByName(input_name) {
        let new_url = `${apiPost}?paginate=10&page=1`;
        const lastname_exists = input_name.indexOf(" ") !== -1;

        if (!lastname_exists) {
            new_url = new_url + `&filter[name]=${input_name}`;
        } else {
            const firts_name = input_name.substr(0,input_name.indexOf(' '));
            const last_name = input_name.substr(input_name.indexOf(' ')+1);
            new_url = new_url + `&filter[name]=${firts_name}&filter[lastname]=${last_name}`;
        }

        new_url = new_url + "&order[name]=asc";
        return new_url;
    } 

    handleChangeSuperior(selectedOption) {
        const values = this.state;
        values.superior_id = selectedOption;
        this.setState({ values });
    }

    mapSelect(dados) {
        const select_array = [];
        dados.map(item => {
            const label = `${item.full_name}`;
            const item_object = {"value": item.id, "label": label};
            select_array.push(item_object);
        });

        return select_array;
    }

    getOptions = (input, callback) => {
        const search_url = this.searchByName(input);
        axios.get(search_url)
        .then(response => {
            const dados = response.data.data;
            
            const select_array = this.mapSelect(dados);

            this.setState({ search_options: select_array }, function(){
                setTimeout(() => {
                    callback(null, {
                    options: this.state.search_options,
                    complete: true
                    });
                }, 500);
            });
        })

      };

    showSuperior() {
        const { superiors, userSearch } = this.props.user;
        
        // let { superior_name } = userSearch;

        const user_id = this.props.match.params.id;

        if (user_id && userSearch && !userSearch.superior_name) {
            return (
                <div className="form-group">
                    <label>Superior</label>
                    <Async
                        removeSelected={false}
                        name="superior_id"
                        id="superior_id"
                        // disabled={this.state.viewMode}
                        value={this.state.superior_id}
                        onChange={this.handleChangeSuperior}
                        loadOptions={this.getOptions}
                        placeholder="Selecione..."
                    />
                </div>
            )
        }

        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label>
                            Superior
                        </label>
                        <Field
                            name="superior_name"
                            type="text"
                            id="superior_name"
                            component={this.renderNameInput}
                            disabled={"disabled"} 
                            // valueOption={superior_name}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            handleSubmit,
            invalid,
            user: {
                requesting,
                successful,
                messages,
                errors,
                current_user
            },
        } = this.props

        const { roles, role_id, subsidiaries, subsidiary_id, sectors, 
            sector_id, ringLoad, userSearch, active
        } = this.props.user;

        let statusField = null;
        
        if(userSearch !== undefined && userSearch !== null){
            if (this.props.match.params.id !== undefined) {
                statusField =
                    <div className="">
                        <div className="form-group form-inline">
                            <label className="" style={{ marginRight: "10px" }}>Status</label>
                            <div className="">
                                <Label className="switch switch-default switch-pill switch-primary">
                                    <Input type="checkbox" id='active' name="active" className="switch-input"
                                        disabled={this.state.viewMode}
                                        checked={active?1:0} 
                                        onChange={this.handleChange} />
                                    <span className="switch-label"></span>
                                    <span className="switch-handle"></span>
                                </Label>
                            </div>
                        </div>
                    </div>
            }
        }

        return (
            <Card>
                <CardBody>
                    <div className="user">
                        {ringLoad == true &&
                            <div className="loader">
                                <div className="backLoading">
                                    <div className="load"></div>
                                </div>
                            </div>
                        }
                        <form onSubmit={handleSubmit(this.submit)}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>
                                            Nome <span className="text-danger"><strong>*</strong></span>
                                        </label>
                                        <Field
                                            name="name"
                                            type="text"
                                            id="name"
                                            validate={fieldRequired}
                                            component={this.renderNameInput}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>
                                            Sobrenome <span className="text-danger"><strong>*</strong></span>
                                        </label>
                                        <Field
                                            name="lastname"
                                            type="text"
                                            id="lastname"
                                            validate={fieldRequired}
                                            component={this.renderNameInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>
                                            Usuário de rede <span className="text-danger"><strong>*</strong></span>
                                        </label>
                                        <Field
                                            name="username"
                                            type="text"
                                            id="username"
                                            validate={fieldRequired}
                                            component={this.renderNameInput}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>
                                            E-mail <span className="text-danger"><strong>*</strong></span>
                                        </label>
                                        <Field
                                            name="email"
                                            type="text"
                                            id="email"
                                            validate={fieldRequired}
                                            component={this.renderNameInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Filial</label>
                                        <Field
                                            name="subsidiary_id"
                                            options={subsidiaries}
                                            onChangeFunction={this.handleChangeSubsidiary}
                                            placeholder="Selecione..."
                                            valueOption={subsidiary_id}
                                            component={this.renderSelectInput}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Setor</label>
                                        <Field
                                            name="sector_id"
                                            options={sectors}
                                            valueOption={sector_id}
                                            onChangeFunction={this.handleChangeSector}
                                            placeholder="Selecione..."
                                            component={this.renderSelectInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>
                                            Senha 
                                            {!this.props.match.params.id &&
                                                <span className="text-danger"><strong>*</strong></span>
                                            }
                                        </label>
                                        <Field
                                            name="password"
                                            type="password"
                                            id="password"
                                            validate={!this.props.match.params.id?fieldRequired:[]}
                                            component={this.renderNameInput}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>
                                            Confirmação de Senha  
                                            {!this.props.match.params.id &&
                                                <span className="text-danger"><strong>*</strong></span>
                                            }
                                        </label>
                                        <Field
                                            name="password_confirmation"
                                            type="password"
                                            id="password_confirmation"
                                            component={this.renderNameInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <div className="form-group">
                                    <label>
                                        Tipo de Usuário <span className="text-danger"><strong>*</strong></span>
                                    </label>

                                        <Field
                                            name="role_id"
                                            options={roles}
                                            placeholder="Selecione..."
                                            onChangeFunction={this.handleChangeRole}
                                            valueOption={role_id}
                                            component={this.renderSelectInput}
                                        />

                                </div>
                            </div> 

                            <div className="">
                                {this.showSuperior()}
                            </div> 

                            {statusField}

                            <button action="submit" className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                            <button type="button" className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>

                        </form>
                    </div>


                </CardBody>
            </Card>
        )
    }
}

let InitializeFromStateForm = reduxForm({
    form: 'InitializeFromState',
    enableReinitialize: true,
    validate,
})(UserForm)

InitializeFromStateForm = connect(
    state => ({
        userCurrent: state.userCurrent,
        user: state.user,
        initialValues: state.user.userSearch
    }),
    { userLoad, userUpdate, userCreate, roleListFlow, changeRoleFlow, getSubsidiariesFlow, changeSubsidiaryFlow, changeSectorFlow, 
        changeStatusFlow, searchByNameFlow, userUpdateWithSuperior, unloadUser
    }
)(InitializeFromStateForm)


export default InitializeFromStateForm