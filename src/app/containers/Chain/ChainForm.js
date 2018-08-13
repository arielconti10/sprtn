import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import { canUser } from '../../common/Permissions';

const apiPost = 'chain';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { chainCreate, chainUpdate, chainLoad, chainCurrentClear } from '../../../actions/chain';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')


class ChainForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        chains: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_chain: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
            })
        }).isRequired,
        chainUpdate: PropTypes.func.isRequired,
        chainCreate: PropTypes.func.isRequired,
        chainLoad: PropTypes.func.isRequired,
        chainCurrentClear: PropTypes.func.isRequired,
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
       
    }

    componentWillMount() {
        this.checkPermission('chain.insert');
        const { chainLoad, user } = this.props
        
        this.props.chains.current_chain = null;
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('chain.update')
            chainLoad(user, this.props.match.params.id)
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
        let active = true;
        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,    
        });
        if(target.type == 'checkbox'){
            active = target.checked
            this.props.chains.current_chain.active = active
        }
    }
    submit = (chain) => {
        const { user, chainCreate, chainUpdate, reset } = this.props
        
        if (this.props.match.params.id !== undefined) {  
            chain.active = this.props.chains.current_chain.active         
            chainUpdate(user, chain, this.props.chains.current_chain.active)
        } else {
            chainCreate(user, chain)
        }

        reset()
    }

    render() {
        const {
            handleSubmit,
            invalid,
            chains: {
                chain,
                requesting,
                successful,
                messages,
                errors,
                current_chain
            },
        } = this.props

        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/redes" />;
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
                        <label htmlFor="name">Nome da rede</label>
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
})(ChainForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        chains: state.chains,
        initialValues: state.chains.current_chain
    }),
    { chainLoad, chainUpdate, chainCreate, chainCurrentClear }
)(InitializeFromStateForm)

export default InitializeFromStateForm