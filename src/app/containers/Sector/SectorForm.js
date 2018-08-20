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
import { sectorCreate, sectorUpdate, sectorLoad, sectorCurrentClear } from '../../../actions/sector';

const apiPost = 'sector';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

class SectorForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        sectors: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_sector: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                code: PropTypes.string,
            })
        }).isRequired,
        sectorUpdate: PropTypes.func.isRequired,
        sectorCreate: PropTypes.func.isRequired,
        sectorLoad: PropTypes.func.isRequired,
        sectorCurrentClear: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            code: '',
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
            }
        }.bind(this));       
    }

    componentWillMount() {
        const { sectorLoad, user } = this.props
        this.checkPermission('sector.insert')
        
        this.props.sectors.current_sector = null;
        if (this.props.match.params.id !== undefined) {
            console.log(this.props.match.params.id)
            this.checkPermission('sector.update')
            sectorLoad(user, this.props.match.params.id)
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
            'code': this.state.code,
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

    submit = (sector) => {
        const { user, sectorCreate, sectorUpdate, reset } = this.props
        
        if (this.props.match.params.id !== undefined) {
            console.log('UPDATE')            
            sectorUpdate(user, sector)
        } else {
            sectorCreate(user, sector)
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
            sectors: {
                sector,
                requesting,
                successful,
                messages,
                errors,
                current_sector
            },
        } = this.props
        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/setores" />;
        }

        let statusField = null;
        if (this.props.match.params.id !== undefined) {
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
                        <label htmlFor="name">Código do setor</label>
                        <Field
                            name="code"
                            id="code"
                            component={this.renderInput}
                            validate={fieldRequired}
                            placeholder="Código do setr"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Nome do setor</label>
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
})(SectorForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        sectors: state.sectors,
        initialValues: state.sectors.current_sector
    }),
    { sectorLoad, sectorUpdate, sectorCreate, sectorCurrentClear }
)(InitializeFromStateForm)

export default InitializeFromStateForm
