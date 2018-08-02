import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Card, CardHeader, CardFooter, CardBody, Button, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import { canUser } from '../../common/Permissions';

// include our indicatorsRequest action
import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { shiftCreate } from '../../../actions/shifts';

const apiPost = 'shift';

// Our validation function for `name` field.
const nameRequired = value => (value ? undefined : 'Name Required')

class ShiftForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        invalid: PropTypes.bool.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          access_token: PropTypes.string.isRequired,
        }),
        shifts: PropTypes.shape({
          list: PropTypes.array,
          requesting: PropTypes.bool,
          successful: PropTypes.bool,
          messages: PropTypes.array,
          errors: PropTypes.array,
        }).isRequired,
        shiftCreate: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
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
        this.checkPermission('shift.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('shift.update');
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;

                    this.setState({ 
                        name: dados.name,
                        code: dados.code,
                        active: dados.deleted_at === null ? true: false
                    });
                })
                .catch(err => console.log(err));
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

    submitForm(event) {
        event.preventDefault();
        axios.post(`${apiPost}`, {
            'name': this.state.name,
            'code': this.state.code,
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

    renderNameInput = ({ input, type, meta: { touched, error } }) => (
        <div>
          {/* Spread RF's input properties onto our input */}
          <input
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
            <div style={{ color: '#cc7a6f', margin: '-10px 0 15px', fontSize: '0.7rem' }}>
              {error}
            </div>
            )
          }
        </div>
      )

    
    submit = (shift) => {
        const { user, shiftCreate, reset } = this.props
        // call to our shiftCreate action.

        shiftCreate(user, shift)
        // reset the form upon submit.
        reset()
      }

    updateForm(event) {
        event.preventDefault();
        var id = this.props.match.params.id;

        let data = {
            'name': this.state.name,
            'code': this.state.code,
            'active': this.state.active
        }

        axios.put(`${apiPost}/${id}`, {
            'name': this.state.name,
            'code': this.state.code,
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
            shifts: {
              list,
              requesting,
              successful,
              messages,
              errors,
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
                {/* {redirect} */}

                <CardBody>
                   
                    {this.state.back_error !== '' &&
                        <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                    }
                    <div className="shifts">
                        <form onSubmit={handleSubmit(this.submit)}>
                        {/* <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                            onSubmit={handleSubmit(this.submit)} noValidate>
                             */}
                            <div className="form-grpup">
                                {/* <FormGroup for="code"> */}
                                    {/* <FormControlLabel htmlFor="code">Código do turno</FormControlLabel> */}
                                    {/* <FormControlInput type="text" id="code" name="code"
                                    value={this.state.code} onChange={this.handleChange}
                                        readOnly={this.state.viewMode}
                                        required /> */}
                                        <label htmlFor="code">Código do turno</label>
                                        <Field 
                                            name="code"
                                            type="text" 
                                            id="code"
                                            readOnly={this.state.viewMode}
                                            component="input"
                                            className="form-control"
                                        />    

                                    {/* <FieldFeedbacks for="code">
                                        <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                    </FieldFeedbacks> */}
                                </div>

                            
                            <div className="form-group">
                                <label htmlFor="name">Nome do turno</label>

                                {/* <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    required /> */}
                                    <Field 
                                        type="text" 
                                        id="name"
                                        name="name"
                                        component="input"
                                        className="form-control"
                                        // onChange={this.handleChange}
                                    />
                                {/* <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks> */}
                            </div>

                            {statusField}     

                            <button action="submit" className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                            <button type="button" className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>
                        {/* </FormWithConstraints> */}
                        </form>
                    </div>
                    

                </CardBody>
            </Card>
        )
    }
}
// Pull in both the Client and the Widgets state
const mapStateToProps = state => ({
    user: state.user,
    shifts: state.shifts,
  })
  
  // Make the Client and Widgets available in the props as well
  // as the shiftCreate() function
  const connected = connect(mapStateToProps, { shiftCreate })(ShiftForm)
  const formed = reduxForm({
    form: 'shifts',
  })(connected)
  
  export default formed