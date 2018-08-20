import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input, Col, Row } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import Select from 'react-select';

import { canUser } from '../../common/Permissions';

import 'react-select/dist/react-select.css';

const apiPost = 'subsidiary';

const apis = [
    { stateArray: 'sectors', api: 'sector' }
];
const selectsValidade = [
    { name: 'sector_array' }
];

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { subsidiaryCreate, subsidiaryUpdate, subsidiaryLoad, subsidiaryCurrentClear } from '../../../actions/subsidiary';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')


class SubsidiaryForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        subsidiarys: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_subsidiary: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                sectors: PropTypes.array,
            })
        }).isRequired,
        subsidiaryUpdate: PropTypes.func.isRequired,
        subsidiaryCreate: PropTypes.func.isRequired,
        subsidiaryLoad: PropTypes.func.isRequired,
        subsidiaryCurrentClear: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
            sector_array: [],
            sectors: [],
            active: true,
            back_error: '',
            submitButtonDisabled: false,
            saved: false,
            valid_select_sector_array: 1
        };

        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.submitForm = this.submitForm.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findSectors = this.findSectors.bind(this);
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

    findSectors() {

        if(this.props.subsidiarys.current_subsidiary){
            if (this.props.match.params.id !== undefined) {
                this.setState({
                    sector_array: this.props.subsidiarys.current_subsidiary.sectors, //setores selecionados
                });           
            }

        }
    }
    componentWillMount(){
        this.props.subsidiarys.current_subsidiary = null;
        
    }
    
    componentDidMount() {
        
        this.checkPermission('subsidiary.insert');
        const { subsidiaryLoad, user } = this.props
        
        this.props.subsidiarys.current_subsidiary = null;

        if (this.props.match.params.id !== undefined) {
            this.checkPermission('subsidiary.update')
            subsidiaryLoad(user, this.props.match.params.id)
            this.findAll();            
        } else {
            this.props.subsidiarys.current_subsidiary = null;       
            this.findAll();
        }
    }

    componentDidUpdate(previousProps, previousState){
        if (this.props.match.params.id !== undefined) {
            if(previousProps.subsidiarys.current_subsidiary){
                if(previousState.sector_array.length == 0){
                    if(previousState.sector_array != previousProps.subsidiarys.current_subsidiary.sectors){
                        this.findSectors()
                    }
                }
            }
        } else {
            console.log(previousProps, previousState)
        }
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
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

    submit = (subsidiary) => {
        const { user, subsidiaryCreate, subsidiaryUpdate, reset } = this.props
        
        subsidiary.sectors = this.state.sector_array; 
        if (this.props.match.params.id !== undefined) { 
            subsidiary.active = this.props.subsidiarys.current_subsidiary.active         
            subsidiaryUpdate(user, subsidiary)
        } else {
            subsidiaryCreate(user, subsidiary)
        }

        reset()
    }

    handleSelectChange = (selectedOption) => {
        this.setState({ valid_select_sector_array: 1, submit_button_disabled: false });

        const sectors_id = selectedOption.map(function (item) {
            return item.id;
        });

        this.setState({ sector_array: sectors_id });
    }

    render() {
        const {
            handleSubmit,
            invalid,
            subsidiarys: {
                subsidiary,
                requesting,
                successful,
                messages,
                errors,
                current_subsidiary
            },
        } = this.props
        
        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/filiais" />;
        }

        let statusField = null;
        if (this.props.match.params.id !== undefined) {
            statusField =
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{ marginRight: "10px" }}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input" checked={this.state.active} 
                                disabled={this.state.viewMode}
                                onChange={this.handleChange} />
                                <span className="switch-label"></span>
                                <span className="switch-handle"></span>
                            </Label>
                        </div>
                    </div>
                </div>
        }
        let current_sector_array
        if(current_subsidiary){
           current_sector_array = current_subsidiary.sectors 
        }
        
        return (
            <Card>
                {redirect}

                <CardBody>
                    {this.state.back_error !== '' &&
                        <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                    }
                    <form onSubmit={handleSubmit(this.submit)}>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Código da filial</label>
                                <Field
                                    name="code"
                                    id="code"
                                    component={this.renderInput}
                                    validate={fieldRequired}
                                    placeholder="Código da filial"
                                />
                            </div>    
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Nome do filial</label>
                                <Field
                                    name="name"
                                    id="name"
                                    component={this.renderInput}
                                    validate={fieldRequired}
                                    placeholder="Nome da filial"
                                />
                            </div> 
                        </div>
                         
                        <div className="form-group">
                            <label>Setor (es) <span className="text-danger"><strong>*</strong></span></label>
                            <Select
                                name="sector_array"
                                id="sector_array"
                                disabled={this.state.viewMode}
                                value={ this.state.sector_array }
                                labelKey="name"
                                valueKey="id"
                                multi={true}
                                onChange={this.handleSelectChange}
                                options={this.state.sectors}
                                placeholder="Selecione..."
                            />
                            {this.state.valid_select_sector_array == 0 &&
                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                            }
                        </div>
                        {statusField}

                        <button className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
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
})(SubsidiaryForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        subsidiarys: state.subsidiarys,
        initialValues: state.subsidiarys.current_subsidiary
    }),
    { subsidiaryLoad, subsidiaryUpdate, subsidiaryCreate, subsidiaryCurrentClear }
)(InitializeFromStateForm)

export default InitializeFromStateForm