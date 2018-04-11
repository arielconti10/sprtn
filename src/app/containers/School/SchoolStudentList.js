import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import axios from '../../common/axios';
const apiSpartan = 'student';

const apis = [
    { stateArray: 'levels', api: 'level' },
    { stateArray: 'shifts', api: 'shift' }
];
class SchoolStudentList extends Component {

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
            shift_id: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.showGrade = this.showGrade.bind(this);
        this.changeLabelGrade = this.changeLabelGrade.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.closeColapse = this.closeColapse.bind(this);
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
        const { id, level_id, shift_id, first_grade, second_grade, third_grade, forth_grade, fifth_grade } = element.value;
        
        console.log('onClickEdit', element.value);

        this.setState({
            id: id,
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
        const { id, level_id, school_id, shift_id, first_grade, second_grade, third_grade, forth_grade, fifth_grade, total } = element.value;

        axios.put(`${apiSpartan}/${id}`, {
            'level_id': level_id,
            'school_id': school_id,
            'shift_id': shift_id,
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

        if (target.name == 'form_level_id') {
            this.showGrade(target.value);
        };

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submit_button_disabled: !this.form.isValid()
        });
    }

    submitForm(event) {
        event.preventDefault();

        const { school_id, form_level_id, form_shift_id, form_first_grade, form_second_grade, form_third_grade, form_forth_grade, form_fifth_grade } = this.state;

        axios.post(`${apiSpartan}`, {
            'school_id': parseInt(school_id),
            'level_id': parseInt(form_level_id),
            'shift_id': parseInt(form_shift_id),
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
        const { id, school_id, form_level_id, form_shift_id, form_first_grade, form_second_grade, form_third_grade, form_forth_grade, form_fifth_grade } = this.state;

        axios.put(`${apiSpartan}/${id}`, {
            'school_id': parseInt(school_id),
            'level_id': parseInt(form_level_id),
            'shift_id': parseInt(form_shift_id),
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

    handleSubmit() {
        this.form.validateFields();

        this.setState({ submit_button_disabled: !this.form.isValid() });

        if (this.form.isValid()) {
            if (!this.state.new) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    componentDidMount() {
        let col = [
            { Header: "Nível", accessor: "level.name", headerClassName: 'text-left', width: 180 },
            { Header: "Turno", accessor: "shift.name", headerClassName: 'text-left' },
            { Header: "1ª grade", accessor: "first_grade", headerClassName: 'text-left' },
            { Header: "2ª grade", accessor: "second_grade", headerClassName: 'text-left' },
            { Header: "3ª grade", accessor: "third_grade", headerClassName: 'text-left' },
            { Header: "4ª grade", accessor: "forth_grade", headerClassName: 'text-left' },
            { Header: "5ª grade", accessor: "fifth_grade", headerClassName: 'text-left' },
            { Header: "Total", accessor: "total", headerClassName: 'text-left' }
        ];

        col.push(
            {
                Header: "Status",
                accessor: "",
                width: 60,
                headerClassName: 'text-left',
                sortable: false,
                Cell: (element) => (
                    !element.value.deleted_at ?
                        <div><span>Ativo</span></div>
                        :
                        <div><span>Inativo</span></div>
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
        )

        this.setState({ columns: col });

        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(err => console.log(err));
        });
    }

    onFetchData = (state, instance, deleted_at) => {

        let pageSize = state ? state.pageSize : this.state.pageSize;
        let page = state ? state.page + 1 : this.state.page;

        let sorted = state ? state.sorted : this.state.sorted
        let filtered = state ? state.filtered : this.state.filtered

        let baseURL = `/${apiSpartan}?paginate=${pageSize}&page=${page}&filter[school_id]=${this.state.school_id}`;

        //To do: make filter to deleted_at
        /*console.log('onFetchData:', deleted_at);
        if(deleted_at != 'all')
            console.log("deleted_at != 'all'", deleted_at);*/

        filtered.map(function (item) {
            baseURL += `&filter[${item.id}]=${item.value}`;
        })

        for (let i = 0; i < sorted.length; i++) {
            baseURL += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
        }

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data.data

                this.setState({
                    data: dados,
                    totalSize: response.data.meta.pagination.total,
                    pages: response.data.meta.pagination.last_page,
                    page: response.data.meta.pagination.current_page,
                    pageSize: parseInt(response.data.meta.pagination.per_page),
                    sorted: sorted,
                    filtered: filtered,
                    loading: false
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { data, pageSize, page, loading, pages, columns, levels, shifts, form_level_id, form_shift_id } = this.state;

        return (
            <div>
                <Collapse isOpen={this.state.collapse}>
                    <Card>
                        <CardBody>
                            <div>
                                {this.state.back_error !== '' &&
                                    <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                                }
                                <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                                    onSubmit={this.handleSubmit} noValidate>

                                    <Row>
                                        <Col md="3">
                                            <FormGroup for="form_level_id">
                                                <label>Nível</label>
                                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                                    id="form_level_id" name="form_level_id" value={this.state.form_level_id}>
                                                    <option key="0" value="0" >Selecione um valor</option>
                                                    {
                                                        levels.map(item => {
                                                            let checked = item.id == form_level_id ? "checked" : "";
                                                            return (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <FieldFeedbacks for="form_level_id">
                                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="3">
                                            <FormGroup for="form_shift_id">
                                                <label>Turno</label>
                                                <select className="form-control" onChange={this.handleChange} disabled={this.state.viewMode}
                                                    id="form_shift_id" name="form_shift_id" value={this.state.form_shift_id}>
                                                    <option key="0" value="0" >Selecione um valor</option>
                                                    {
                                                        shifts.map(item => {
                                                            let checked = item.id == form_shift_id ? "checked" : "";
                                                            return (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <FieldFeedbacks for="form_shift_id">
                                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="2" className={this.state.class_form_first_grade}>
                                            <FormGroup for="form_first_grade">
                                                <FormControlLabel htmlFor="form_first_grade">{this.state.label_first_grade}</FormControlLabel>
                                                <FormControlInput type="number" id="form_first_grade" name="form_first_grade" readOnly={false}
                                                    value={this.state.form_first_grade} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_first_grade">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                    <FieldFeedback when={value => value < 0}>Este campo possui um valor inválido</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2" className={this.state.class_form_second_grade}>
                                            <FormGroup for="form_second_grade">
                                                <FormControlLabel htmlFor="form_second_grade">{this.state.label_second_grade}</FormControlLabel>
                                                <FormControlInput type="number" id="form_second_grade" name="form_second_grade" readOnly={false}
                                                    value={this.state.form_second_grade} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_second_grade">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                    <FieldFeedback when={value => value < 0}>Este campo possui um valor inválido</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2" className={this.state.class_form_thirth_grade}>
                                            <FormGroup for="form_third_grade">
                                                <FormControlLabel htmlFor="form_third_grade">{this.state.label_third_grade}</FormControlLabel>
                                                <FormControlInput type="number" id="form_third_grade" name="form_third_grade" readOnly={false}
                                                    value={this.state.form_third_grade} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_third_grade">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                    <FieldFeedback when={value => value < 0}>Este campo possui um valor inválido</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2" className={this.state.class_form_forth_grade}>
                                            <FormGroup for="form_forth_grade">
                                                <FormControlLabel htmlFor="form_forth_grade">{this.state.label_forth_grade}</FormControlLabel>
                                                <FormControlInput type="number" id="form_forth_grade" name="form_forth_grade" readOnly={false}
                                                    value={this.state.form_forth_grade} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_forth_grade">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                    <FieldFeedback when={value => value < 0}>Este campo possui um valor inválido</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2" className={this.state.class_form_fifth_grade}>
                                            <FormGroup for="form_fifth_grade">
                                                <FormControlLabel htmlFor="form_fifth_grade">{this.state.label_fifth_grade}</FormControlLabel>
                                                <FormControlInput type="number" id="form_fifth_grade" name="form_fifth_grade" readOnly={false}
                                                    value={this.state.form_fifth_grade} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_fifth_grade">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                    <FieldFeedback when={value => value < 0}>Este campo possui um valor inválido</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                    </Row>
                                </FormWithConstraints>
                            </div>
                            <div>
                                <Row>
                                    <Col md="1">
                                        <Button color='primary' onClick={() => this.onClickSave()} disabled={this.state.submit_button_disabled}><i className="fa fa-plus-circle"></i> Salvar</Button>
                                    </Col>
                                    <Col md="1">
                                        <Button color='danger' onClick={() => this.onClickCancel()}><i className="fa fa-plus-circle"></i> Cancelar</Button>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Collapse>
                <div>
                    <Row>
                        <Col md="2">
                            <Button color='primary' disabled={this.state.blockButton} onClick={() => this.onClickAdd()}><i className="fa fa-plus-circle"></i> Adicionar</Button>
                        </Col>
                    </Row>
                    <br />
                </div>
                <div>
                    <Row>
                        <Col md="12">
                            <ReactTable
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                defaultPageSize={pageSize}
                                manual
                                onFetchData={this.onFetchData}
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

export default SchoolStudentList;