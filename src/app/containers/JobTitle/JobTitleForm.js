import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import { canUser } from '../../common/Permissions';

const apiSelectBox = 'job-title-type';
const apiPost = 'job-title';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { job_titleCreate, job_titleUpdate, job_titleLoad, job_titleCurrentClear } from '../../../actions/job_title';

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')


class JobTitleForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        job_titles: PropTypes.shape({
            list: PropTypes.array,
            requesting: PropTypes.bool,
            successful: PropTypes.bool,
            messages: PropTypes.array,
            errors: PropTypes.array,
            current_job_title: PropTypes.shape({
                active: PropTypes.bool,
                name: PropTypes.string,
                job_title_type_id: PropTypes.number
            })
        }).isRequired,
        job_titleUpdate: PropTypes.func.isRequired,
        job_titleCreate: PropTypes.func.isRequired,
        job_titleLoad: PropTypes.func.isRequired,
        job_titleCurrentClear: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        initialValues: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
            job_types: [],
            code: '',
            name: '',
            job_title_type_id: '0',  
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

    componentWillMount() {
        
    }

    componentDidMount() {
        const { job_titleLoad, user } = this.props
        this.checkPermission('job-title.insert');
        
        this.setState({job_title_type_id: "0"})
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('job-title.update');
            job_titleLoad(user, this.props.match.params.id)
            this.findJobTitles()
            
        }
        
    }

    componentDidUpdate(previousProps, previousState){
        if (this.props.match.params.id !== undefined) {
            if(this.props.job_titles.current_job_title != undefined){
                if(this.props.job_titles.current_job_title.job_title_type_id != previousState.job_title_type_id){
                    this.setState({job_title_type_id: this.props.job_titles.current_job_title.job_title_type_id})
                }
            }
        }
    }

    findJobTitles(){
        axios.get(`${apiSelectBox}`)
        .then(response => {
            const dados = response.data.data;
            this.setState({ job_types: dados });
        })
        .catch(err => console.log(err));
    }

    handleChange(e) {
        const target = e.currentTarget;
        let active = true;

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,    
        });
        if(target.type == 'checkbox'){
            active = target.checked
            this.props.job_titles.current_job_title.active = active
        }

    }

    submit = (job_title) => {
        const { user, job_titleCreate, job_titleUpdate, reset } = this.props
        job_title.job_title_type_id = this.state.job_title_type_id; 
        if (this.props.match.params.id !== undefined) { 
            job_title.active = this.props.job_titles.current_job_title.active         
            job_titleUpdate(user, job_title)
        } else {
            job_titleCreate(user, job_title)
        }

        reset()
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextProps
     }

    render() {
        const {
            handleSubmit,
            invalid,
            job_titles: {
                job_title,
                requesting,
                successful,
                messages,
                errors,
                current_job_title
            },
        } = this.props

        //console.log(this.props);

        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/cargos" />;
        }

        let statusField = null;
        if (this.props.match.params.id != undefined) {
            statusField =
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{marginRight: "10px"}}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input"  checked={this.state.active} 
                                onChange={this.handleChange}
                                disabled={this.state.viewMode}
                                />
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
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Código do cargo</label>
                                <Field
                                    name="code"
                                    id="code"
                                    component={this.renderInput}
                                    validate={fieldRequired}
                                    placeholder="Código do cargo"
                                />
                            </div>    
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Nome do cargo</label>
                                <Field
                                    name="name"
                                    id="name"
                                    component={this.renderInput}
                                    validate={fieldRequired}
                                    placeholder="Nome do cargo"
                                />
                            </div> 
                        </div>
                        <div className="">
                            <div className="form-group">
                                <label>Tipo do cargo</label>
                                <select required className="form-control" onChange={this.handleChange}
                                    id="job_title_type_id" name="job_title_type_id" value={this.state.job_title_type_id}
                                    disabled={this.state.viewMode}>
                                    <option key="0" value="0" >Selecione um valor</option>
                                    {
                                        this.state.job_types.map(data => {
                                            return (
                                                <option key={data.id} value={data.id} >
                                                    {data.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                {/* <FieldFeedbacks for="job_title_type_id">
                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks> */}
                            </div>
                        </div>   

                        {statusField}     

                        <button className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                        <button className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>
                    </form>
                    
                </CardBody>
            </Card>
        )
    }
}
let InitializeFromStateForm = reduxForm({
    form: 'InitializeFromState',
    enableReinitialize: true
})(JobTitleForm)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        job_titles: state.job_titles,
        initialValues: state.job_titles.current_job_title
    }),
    { job_titleLoad, job_titleUpdate, job_titleCreate, job_titleCurrentClear }
)(InitializeFromStateForm)

export default InitializeFromStateForm