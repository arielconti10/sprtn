import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import ReactTable from 'react-table'
import Select from 'react-select';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'

import { 
    studentsRequest, 
    studentsCreate, 
    studentsSelectLevel, 
    studentsSelectShift,
    unloadStudents,
} from '../../../actions/students'

import 'react-select/dist/react-select.css';
import 'react-table/react-table.css'

import axios from '../../common/axios';

import { canUser } from '../../common/Permissions';

const apiSpartan = 'student';

const apis = [
    { stateArray: 'levels', api: 'level' },
    { stateArray: 'shifts', api: 'shift' }
];

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório')

const validate = values => {
    const errors = {}

    switch(values.form_shift_id){
        case 1 : 
            if( !values.first_grade 
                && !values.form_second_grade
                && !values.form_third_grade 
                && !values.form_forth_grade
            ) {
                errors.form_first_grade  = 'Required'
                errors.form_second_grade = 'Required'
                errors.form_third_grade  = 'Required'
                errors.form_forth_grade  = 'Required'
            }
    }
    return errors;
    
  }

class SchoolStudentList extends Component {
    static propTypes = {
        user: PropTypes.object,
        studentsCreate: PropTypes.func,
        studentsSelectLevel: PropTypes.func,
        studentsSelectShift: PropTypes.func,
        unloadStudents: PropTypes.func,
        handleSubmit: PropTypes.func,
        students: PropTypes.shape({

        })
    }

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 5,
            data: [],
            filtered: [],
            sorted: [],
            pages: null,
            loading: false,
            columns: [],

            collapse: false,
            selectedOption: '',
            blockButton: false,
            back_error: '',
            submit_button_disabled: false,
            new: true,

            levels: [],
            shifts: [],

            class_form_first_grade: 'd-none',
            class_form_second_grade: 'd-none',
            class_form_thirth_grade: 'd-none',
            class_form_forth_grade: 'd-none',
            class_form_fifth_grade: 'd-none',

            label_first_grade: '',
            label_second_grade: '',
            label_third_grade: '',
            label_forth_grade: '',
            label_fifth_grade: '',

            form_year: 0,
            form_level_id: 0,
            form_shift_id: 0,
            form_first_grade: 0,
            form_second_grade: 0,
            form_third_grade: 0,
            form_forth_grade: 0,
            form_fifth_grade: 0,

            id: null,
            school_id: this.props.schoolId,
            level_id: 0,
            shift_id: 0,

            valid_select: 1
        };

        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.showGrade = this.showGrade.bind(this);
        this.changeLabelGrade = this.changeLabelGrade.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.closeColapse = this.closeColapse.bind(this);
        this.handleChangeLevel = this.handleChangeLevel.bind(this);
        this.handleChangeShift = this.handleChangeShift.bind(this);
        this.footerData = this.footerData.bind(this);
    }

    renderInput = ({ input, type, meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
            />

            {touched && error && (
                <div style={{ color: 'red' }}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderSelectInput = ({ input, name, valueOption, options, labelKey, valueKey, onChangeFunction ,meta: { touched, error } }) => (
        <div className="form-group group-select">
            <Select
                {...input}
                name={name}
                id={name}
                onChange={onChangeFunction}
                options={options}
                value={valueOption}
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

    handleChangeLevel = (selectedOption) => {
        // console.log(selectedOption)
        // this.setState({ valid_select: 1, submit_button_disabled: false });
        
        // const values = this.state;
        // values.form_level_id = selectedOption.value;
        
        // this.setState({ values });
        // console.log(values)
        this.props.studentsSelectLevel( selectedOption.value )
        
        this.showGrade(selectedOption.value);
    }

    handleChangeShift = (selectedOption) => {
        // console.log(selectedOption)
        this.props.studentsSelectShift( selectedOption.value )
        
        // const values = this.state;
        // values.form_shift_id = selectedOption.value;
        // this.setState({ values });
    }

    clearForm() {
        this.setState({
            class_form_first_grade: 'd-none',
            class_form_second_grade: 'd-none',
            class_form_thirth_grade: 'd-none',
            class_form_forth_grade: 'd-none',
            class_form_fifth_grade: 'd-none',

            label_first_grade: '',
            label_second_grade: '',
            label_third_grade: '',
            label_forth_grade: '',
            label_fifth_grade: '',

            form_year: 0,
            form_level_id: 0,
            form_shift_id: 0,
            form_first_grade: 0,
            form_second_grade: 0,
            form_third_grade: 0,
            form_forth_grade: 0,
            form_fifth_grade: 0
        });
    }

    closeColapse() {
        this.clearForm();
        this.setState({
            blockButton: false,
            collapse: false
        });
    }

    onClickDelete(element) {
        const { id } = element.value;

        axios.delete(`${apiSpartan}/${id}`).
            then(res => {
                this.onFetchData();
            }).catch(function (error) {
                console.log(error)
            }.bind(this));
    }

    onClickEdit(element) {
        const { id, year, level_id, shift_id, first_grade, second_grade, third_grade, forth_grade, fifth_grade } = element.value;

        this.setState({
            id: id,
            form_year: year,
            form_level_id: level_id,
            form_shift_id: shift_id,
            form_first_grade: first_grade,
            form_second_grade: second_grade,
            form_third_grade: third_grade,
            form_forth_grade: forth_grade,
            form_fifth_grade: fifth_grade,
            blockButton: true,
            collapse: true,
            new: false
        });

        this.showGrade(level_id);
    }

    onClickAdd() {
        this.setState({
            blockButton: true,
            collapse: true,
            new: true
        });

    }

    onClickSave() {
        this.handleSubmit();
    }

    onClickCancel() {
        this.closeColapse();
    }

    onClickActive(element) {
        const { id, year, level_id, school_id, shift_id, first_grade, second_grade, third_grade, forth_grade, fifth_grade, total } = element.value;

        axios.put(`${apiSpartan}/${id}`, {
            'year': year,
            'level_id': level_id,
            'school_id': school_id,
            'shift_id': parseInt(form_shift_id) || 0,
            'first_grade': first_grade,
            'second_grade': second_grade,
            'third_grade': third_grade,
            'forth_grade': forth_grade,
            'fifth_grade': fifth_grade,
            'active': true
        }).then(res => {
            this.onFetchData();
        }).catch(function (error) {
            console.log(error)
        }.bind(this));
    }

    showGrade(level) {
        let display_first = '';
        let display_second = '';
        let display_thirth = '';
        let display_forth = '';
        let display_fifth = '';

        switch (level.toString()) {
            case '1':
                display_fifth = 'd-none';
                break;
            case '2':
                break;
            case '3':
                display_fifth = 'd-none';
                break;
            case '4':
                display_forth = 'd-none';
                display_fifth = 'd-none';
                break;
            default:
                display_first = 'd-none';
                display_second = 'd-none';
                display_thirth = 'd-none';
                display_forth = 'd-none';
                display_fifth = 'd-none';
        };

        this.setState({
            class_form_first_grade: display_first,
            class_form_second_grade: display_second,
            class_form_thirth_grade: display_thirth,
            class_form_forth_grade: display_forth,
            class_form_fifth_grade: display_fifth
        });

        this.changeLabelGrade(level);
    }

    changeLabelGrade(level) {
        let label_first_grade = '';
        let label_second_grade = '';
        let label_third_grade = '';
        let label_forth_grade = '';
        let label_fifth_grade = '';

        switch (level.toString()) {
            case '1':
                label_first_grade = '2 anos';
                label_second_grade = '3 anos';
                label_third_grade = '4 anos';
                label_forth_grade = '5 anos';
                break;
            case '2':
                label_first_grade = '1ª série';
                label_second_grade = '2ª série';
                label_third_grade = '3ª série';
                label_forth_grade = '4ª série';
                label_fifth_grade = '5ª série';
                break;
            case '3':
                label_first_grade = '6ª série';
                label_second_grade = '7ª série';
                label_third_grade = '8ª série';
                label_forth_grade = '9ª série';
                break;
            default:
                label_first_grade = '1ª série';
                label_second_grade = '2ª série';
                label_third_grade = '3ª série';
        };

        this.setState({
            label_first_grade,
            label_second_grade,
            label_third_grade,
            label_forth_grade,
            label_fifth_grade
        });
    }

    handleChange(e) {
        const target = e.currentTarget;
        console.log(target, target.value)
        if (target.name == 'form_level_id') {
            this.showGrade(target.value);
        };

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submit_button_disabled: !this.form.isValid()
        });
    }

    submit = (e) => {
        const { user, studentsCreate, reset } = this.props

        console.log(this.props.schoolId)

        const dataStudents = { 
            fifth_grade: e.form_fifth_grade,
            first_grade: e.form_first_grade,
            forth_grade: e.form_forth_grade,
            second_grade: e.form_second_grade,
            third_grade: e.form_third_grade,
            year: e.form_year,
            level_id: this.props.students.levelId,
            shift_id: this.props.students.shiftId,
            school_id: this.props.schoolId
        }


        // if (this.props.match.params.id !== undefined) {
        //     shiftUpdate(user, shift)
        // } else {
            studentsCreate(user, dataStudents)
        // }

        // studentsCreate(user, students, this.props.school_id)

        // reset the form upon submit.
        reset()

    }

    submitForm(event) {
        event.preventDefault();
        
        // const { school_id, form_level_id, form_first_grade, form_second_grade, form_third_grade, form_forth_grade, form_fifth_grade } = this.state;
        const { school_id, form_year, form_level_id, form_shift_id, form_first_grade, form_second_grade, form_third_grade, form_forth_grade, form_fifth_grade } = this.state;

        // let form_shift_id = (this.state.form_shift_id && this.state.form_shift_id > 0) ? parseInt(this.state.form_shift_id) : null;

        console.log('form_shift_id', form_shift_id)
        axios.post(`${apiSpartan}`, {
            'year': parseInt(form_year),
            'school_id': parseInt(school_id),
            'level_id': parseInt(form_level_id),
            'shift_id': parseInt(form_shift_id) || 0,
            'first_grade': parseInt(form_first_grade),
            'second_grade': parseInt(form_second_grade),
            'third_grade': parseInt(form_third_grade),
            'forth_grade': this.state.class_form_forth_grade == '' ? parseInt(form_forth_grade) : 0,
            'fifth_grade': this.state.class_form_fifth_grade == '' ? parseInt(form_fifth_grade) : 0,
            'active': true
        }).then(res => {
            this.closeColapse();
            this.onFetchData();
        }).catch(function (error) {
            alert(error);
            this.setState({ back_error: error || '' });
        }.bind(this));
    }

    updateForm(event) {

        event.preventDefault();
        const { id, form_year, school_id, form_level_id, form_shift_id, form_first_grade, form_second_grade, form_third_grade, form_forth_grade, form_fifth_grade } = this.state;

        console.log('form_shift_id', form_shift_id)
        axios.put(`${apiSpartan}/${id}`, {
            'year': parseInt(form_year),
            'school_id': parseInt(school_id),
            'level_id': parseInt(form_level_id),
            'shift_id': parseInt(form_shift_id) || 0,
            'first_grade': parseInt(form_first_grade),
            'second_grade': parseInt(form_second_grade),
            'third_grade': parseInt(form_third_grade),
            'forth_grade': this.state.class_form_forth_grade == '' ? parseInt(form_forth_grade) : 0,
            'fifth_grade': this.state.class_form_fifth_grade == '' ? parseInt(form_fifth_grade) : 0,
            'active': true
        }).then(res => {
            this.closeColapse();
            this.onFetchData();
        }).catch(function (error) {
            alert(error);
            this.setState({ back_error: error || '' });
        });
    }

    // handleSubmit() {
    //     this.form.validateFields();

    //     this.setState({ submit_button_disabled: !this.form.isValid() });

    //     if (this.state.form_level_id === undefined || this.state.form_level_id == 0) {
    //         this.setState({ valid_select: 0, submit_button_disabled: true });
    //         return;
    //     } else {
    //         this.setState({ valid_select: 1 });
    //     }

    //     if (this.form.isValid()) {
    //         if (!this.state.new) {
    //             this.updateForm(event);
    //         } else {
    //             this.submitForm(event);
    //         }
    //     }
    // }

    componentWillMount() {
        // console.log(this.props)
        this.props.unloadStudents()
    }
    componentDidMount() {
        this.checkPermission();

        apis.map(item => {
            axios.get(`${item.api}`)
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

    checkPermission() {
        canUser('school.update', this.props.history, "change", function (rules) {
            if (rules.length == 0) {
                this.setState({ viewMode: true, blockButton: true });
            }
        }.bind(this));
    }

    footerData(data, column) {
        let result = data.reduce((total, element, index, array) => {
            total += element[column];
            if (!element.deleted_at) {
                return total;
            } else {
                return total - element[column];
            }
        }, 0);

        return result;
    }

    render() {
        const { data, pageSize, page, loading, pages, columns, levels, shifts, form_year, form_level_id, form_shift_id } = this.state;

        const {
            handleSubmit,
        } = this.props;

        const { levelId, shiftId } = this.props.students;
        return (
            <div>
                <Collapse isOpen={this.state.collapse}>
                    <Card>
                        <CardBody>
                            <div>
                                {this.state.back_error !== '' &&
                                    <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                                }

                                <form onSubmit={handleSubmit(this.submit)}>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-group" htmlFor="form_year">
                                                <label htmlFor="form_year">Ano <span className="text-danger"><strong>*</strong></span></label>
                                                <Field
                                                    type="number"
                                                    id="form_year"
                                                    name="form_year"
                                                    readOnly={this.state.viewMode}
                                                    valueOption={this.state.form_year}
                                                    component={this.renderInput}
                                                     />

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group" htmlFor="form_level_id">
                                                <label>Nível <span className="text-danger"><strong>*</strong></span></label>
                                                
                                                <Field 
                                                    name="form_level_id"
                                                    id="form_level_id"
                                                    disabled={this.state.viewMode}
                                                    valueOption={levelId}
                                                    onChangeFunction={this.handleChangeLevel}
                                                    options={levels}
                                                    component={this.renderSelectInput}
                                                />
                                                
                                                
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="form-group" htmlFor="form_shift_id">
                                                <label>Turno</label>
                                                <Field 
                                                    name="form_shift_id"
                                                    id="form_shift_id"
                                                    disabled={this.state.viewMode}
                                                    valueOption={shiftId}
                                                    onChangeFunction={this.handleChangeShift}
                                                    options={shifts}
                                                    component={this.renderSelectInput}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className={this.state.class_form_first_grade + " col-md-2"}>
                                            <div className="form-group" htmlFor="form_first_grade">
                                                <label htmlFor="form_first_grade">{this.state.label_first_grade} <span className="text-danger"><strong>*</strong></span></label>
                                                <Field
                                                    type="number"
                                                    id="form_first_grade"
                                                    name="form_first_grade"
                                                    readOnly={false}
                                                    value={this.state.form_first_grade}
                                                    component={this.renderInput}
                                                    
                                                />

                                            </div>
                                        </div>

                                        <div className="" className={this.state.class_form_second_grade + " col-md-2" } >
                                            <div className="form-group" htmlFor="form_second_grade">
                                                <label htmlFor="form_second_grade">{this.state.label_second_grade} <span className="text-danger"><strong>*</strong></span></label>
                                                <Field
                                                    type="number"
                                                    id="form_second_grade"
                                                    name="form_second_grade"
                                                    readOnly={false}
                                                    value={this.state.form_second_grade}
                                                    
                                                    component={this.renderInput} />

                                            </div>
                                        </div>

                                        <div className={this.state.class_form_thirth_grade + " col-md-2"}>
                                            <div className="form-group" htmlFor="form_third_grade">
                                                <label htmlFor="form_third_grade">{this.state.label_third_grade} <span className="text-danger"><strong>*</strong></span></label>
                                                <Field
                                                    type="number"
                                                    id="form_third_grade"
                                                    name="form_third_grade"
                                                    readOnly={false}
                                                    value={this.state.form_third_grade}
                                                    
                                                    component={this.renderInput} />

                                            </div>
                                        </div>

                                        <div className={this.state.class_form_forth_grade + " col-md-2"}>
                                            <div className="form-group" htmlFor="form_forth_grade">
                                                <label htmlFor="form_forth_grade">{this.state.label_forth_grade} <span className="text-danger"><strong>*</strong></span></label>
                                                <Field
                                                    type="number"
                                                    id="form_forth_grade"
                                                    name="form_forth_grade"
                                                    readOnly={false}
                                                    value={this.state.form_forth_grade}
                                                    component={this.renderInput}
                                                    
                                                />

                                            </div>
                                        </div>

                                        <div className={this.state.class_form_fifth_grade + " col-md-2"}>
                                            <div className="form-group" htmlFor="form_fifth_grade">
                                                <label htmlFor="form_fifth_grade">{this.state.label_fifth_grade} <span className="text-danger"><strong>*</strong></span></label>
                                                <Field
                                                    type="number"
                                                    id="form_fifth_grade"
                                                    name="form_fifth_grade"
                                                    readOnly={false}
                                                    value={this.state.form_fifth_grade}
                                                    component={this.renderInput}
                                                    
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-1">
                                            <button action="submit" className="btn btn-primary" disabled={this.state.submit_button_disabled}>Salvar</button>
                                            </div>
                                            <div className="col-md-1">
                                                <Button color='danger' onClick={() => this.onClickCancel()}><i className="fa fa-plus-circle"></i> Cancelar</Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </CardBody>
                    </Card>
                </Collapse>
                <div>
                    <div className="row">
                        <div className="col-md-2">
                            <Button color='primary' disabled={this.state.blockButton} onClick={() => this.onClickAdd()}><i className="fa fa-plus-circle"></i> Adicionar</Button>
                        </div>
                    </div>
                    <br />
                </div>
                <div>
                    <Row>
                        <Col md="12">
                            <ReactTable
                                data={this.props.school.students}
                                defaultPageSize={5}
                                columns={[
                                    { Header: "Ano", accessor: "year", headerClassName: 'text-left', filterable: true },
                                    { Header: "Nível", accessor: "level.name", headerClassName: 'text-left', filterable: true, width: 180, Footer: (<span><strong>Total</strong></span>) },
                                    {
                                        Header: "1ª grade", accessor: "first_grade", headerClassName: 'text-left',
                                        Footer: (
                                            <span>
                                                <strong>
                                                    {this.footerData(data, 'first_grade')}
                                                </strong>
                                            </span>
                                        )
                                    },
                                    {
                                        Header: "2ª grade", accessor: "second_grade", headerClassName: 'text-left',
                                        Footer: (
                                            <span>
                                                <strong>
                                                    {this.footerData(data, 'second_grade')}
                                                </strong>
                                            </span>
                                        )
                                    },
                                    {
                                        Header: "3ª grade", accessor: "third_grade", headerClassName: 'text-left',
                                        Footer: (
                                            <span>
                                                <strong>
                                                    {this.footerData(data, 'third_grade')}
                                                </strong>
                                            </span>
                                        )
                                    },
                                    {
                                        Header: "4ª grade", accessor: "forth_grade", headerClassName: 'text-left',
                                        Footer: (
                                            <span>
                                                <strong>
                                                    {this.footerData(data, 'forth_grade')}
                                                </strong>
                                            </span>
                                        )
                                    },
                                    {
                                        Header: "5ª grade", accessor: "fifth_grade", headerClassName: 'text-left',
                                        Footer: (
                                            <span>
                                                <strong>
                                                    {this.footerData(data, 'fifth_grade')}
                                                </strong>
                                            </span>
                                        )
                                    },
                                    {
                                        Header: "Total Nível", accessor: "total", headerClassName: 'text-left',
                                        Footer: (
                                            <span>
                                                <strong>
                                                    {this.footerData(data, 'total')}
                                                </strong>
                                            </span>
                                        )
                                    },
                                    {
                                        Header: "Status",
                                        accessor: "",
                                        width: 80,
                                        headerClassName: 'text-left',
                                        sortable: false,
                                        Cell: (element) => (
                                            !element.value.deleted_at ?
                                                <div><span className="alert-success grid-record-status">Ativo</span></div>
                                                :
                                                <div><span className="alert-danger grid-record-status">Inativo</span></div>
                                        )/*,                
                                            filterable: true, 
                                            Filter: ({ filter, onChange }) => (
                                            
                                                <select
                                                    onChange={event => this.onFetchData(null, null, event.target.value, { filter, onChange })}
                                                    style={{ width: "100%" }}
                                                >
                                                    <option value="all">Todos</option>
                                                    <option value="false">Ativo</option>
                                                    <option value="true">Inativo</option>
                                                </select>
                                            )*/
                                    }, {
                                        Header: "Ações", accessor: "", sortable: false, width: 90, headerClassName: 'text-left', Cell: (element) => (
                                            !element.value.deleted_at ?
                                                <div>
                                                    <button className='btn btn-primary btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickEdit(element)}>
                                                        <i className='fa fa-pencil'></i>
                                                    </button>

                                                    <button className='btn btn-danger btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickDelete(element)}>
                                                        <i className='fa fa-ban'></i>
                                                    </button>
                                                </div>
                                                :
                                                <div>
                                                    <button className='btn btn-success btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickActive(element)}>
                                                        <i className='fa fa-check-circle'></i>
                                                    </button>
                                                </div>
                                        )
                                    }
                                ]}
                                loading={loading}
                                // manual
                                // onFetchData={this.onFetchData}
                                previousText='Anterior'
                                nextText='Próximo'
                                loadingText='Carregando...'
                                noDataText='Sem registros'
                                pageText='Página'
                                ofText='de'
                                rowsText=''
                                className='-striped -highlight'
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
let InitializeFromStateForm = reduxForm({
    form: 'SchoolStudentForm',
    validate,
    // enableReinitialize: true
})(SchoolStudentList)

InitializeFromStateForm = connect(
    state => ({
        user: state.user,
        students: state.students,
        // initialValues: state.shifts.current_shift
    }),
    { studentsCreate, studentsSelectLevel,studentsSelectShift, unloadStudents }
)(InitializeFromStateForm)

export default InitializeFromStateForm
