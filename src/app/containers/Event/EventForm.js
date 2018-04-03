import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';


const apiSelectBox = 'job-title-type';
const apiPost = 'job-title';

class SubsidiariesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job_types: [],
            internal_code: '',
            internal_name: '',
            job_title_type_id: '',
            back_error: '',
            submitButtonDisabled: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentWillMount() {
        /*if (sessionStorage.getItem("access_token") == null) {
            window.location.href = "#/spartan/login";
        }*/

        console.log(this.props)
        if (this.props.params.id !== undefined) {
            axios.get(`${apiPost}/${this.props.params.id}`)
                .then(response => {
                    const dados = response.data.data;
                    this.setState({ internal_code: dados.code });
                    this.setState({ internal_name: dados.name });
                    this.setState({ job_title_type_id: dados.job_title_type_id });
                    console.log(this.state.job_title_type_id);
                })
                .catch(err => console.log(err));
        }
    }

    componentDidMount() {
        axios.get(`${apiSelectBox}?page=1`)
            .then(response => {
                const dados = response.data.data;
                this.setState({ job_types: dados });
                this.setState({ job_title_type_id: dados[0].id });
            })
            .catch(err => console.log(err));
    }

    handleChange(e) {
        const target = e.currentTarget;

        this.form.validateFields(target);

        this.setState({
            [target.name]: target.value,
            submitButtonDisabled: !this.form.isValid()
        });

    }

    submitForm(event) {
        //event.preventDefault();
        axios.post(`${apiPost}`, {
            'code': this.state.internal_code.toUpperCase(),
            'name': this.state.internal_name,
            'job_title_type_id': this.state.job_title_type_id
        }).then(res => {
            window.location.href = "#/job-titles";
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({ back_error: data_error[filterId] });
        }.bind(this));
    }

    updateForm(event) {
        //event.preventDefault();
        var id = this.props.params.id;
        axios.put(`${apiPost}/${id}`, {
            'code': this.state.internal_code.toUpperCase(),
            'name': this.state.internal_name,
            'job_title_type_id': this.state.job_title_type_id
        }).then(res => {
            window.location.href = "#/job-titles";
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error).toString();
            this.setState({ back_error: data_error[filterId] });
        }.bind(this));
    }

    handleSubmit(e) {
        //e.preventDefault();

        this.form.validateFields();

        this.setState({ submitButtonDisabled: !this.form.isValid() });

        if (this.form.isValid()) {
            if (this.props.params.id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    render() {
        console.log(this.props);
        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Cargos
                </CardHeader>
                <CardBody>
                    <Button color='primary' onClick={this.props.history.goBack}><i className="fa fa-arrow-circle-left"></i> Voltar</Button>
                    {this.state.back_error !== '' &&
                        <h4 class="alert alert-danger"> {this.state.back_error} </h4>
                    }

                    <div className="row">
                        <article className="col-sm-12">

                            <JarvisWidget editbutton={false} color="darken" deletebutton={false} colorbutton={false} >
                                <header>
                                    <span className="widget-icon"> <i className="fa fa-table" /> </span>
                                    <h2>Cadastrar Cargo</h2>
                                </header>
                                <div>
                                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                                        onSubmit={this.handleSubmit} noValidate>

                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <FormGroup for="internal_code">
                                                <FormControlLabel htmlFor="internal_code">Código</FormControlLabel>
                                                <FormControlInput type="text" id="internal_code" name="internal_code"
                                                    value={this.state.internal_code} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="internal_code">
                                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <FormGroup for="internal_name">
                                                <FormControlLabel htmlFor="internal_name">Nome</FormControlLabel>
                                                <FormControlInput type="text" id="internal_name" name="internal_name"
                                                    value={this.state.internal_name} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="internal_name">
                                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div className="form-group">
                                                <label for="job_title_type_id">Tipo do Cargo</label>
                                                <select className="form-control" onChange={this.handleChange}
                                                    id="job_title_type_id" name="job_title_type_id">
                                                    {
                                                        this.state.job_types.map(data => {
                                                            const checked = data.id == this.state.job_title_type_id ? "checked" : "";
                                                            return (
                                                                <option value={data.id} selected={checked}>
                                                                    {data.name}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <button className="btn btn-primary">Salvar</button>
                                        <button className="btn btn-danger" onClick={() => Router.History.back()}>Cancelar</button>
                                    </FormWithConstraints>
                                </div>
                            </JarvisWidget>

                        </article>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default SubsidiariesForm;