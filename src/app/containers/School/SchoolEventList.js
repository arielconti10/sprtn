import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput, FormControl } from 'react-form-with-constraints-bootstrap4';
import ReactTable from 'react-table'
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TimePicker from 'react-time-picker'
import Flatpickr from 'react-flatpickr'

import 'flatpickr/dist/themes/material_blue.css'
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'react-table/react-table.css'

import axios from '../../common/axios';
const apiSpartan = 'event';

const apis = [
    //{ stateArray: 'visit_types', api: 'visit-type' },
    { stateArray: 'actions', api: 'action' }
];

moment.locale('pt-BR');

class SchoolEventList extends Component {

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

            visit_types: [
                { value: '1', label: 'Tipo 1' },
                { value: '2', label: 'Tipo 2' },
                { value: '3', label: 'Tipo 3' }
            ],
            actions: [],

            id: null,
            form_name: '',
            form_start_date: '',
            form_start_time: '',
            form_duration: '',
            form_visit_type_id: 0,
            form_user_id: 0,
            form_action_id: 0,
            form_school_id: this.props.schoolId,
            form_observations: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.closeColapse = this.closeColapse.bind(this);
        this.handleChangeVisitType = this.handleChangeVisitType.bind(this);
        this.handleChangeAction = this.handleChangeAction.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeDuration = this.handleChangeDuration.bind(this);
    }

    handleChangeVisitType = (selectedOption) => {
        const values = this.state;
        values.form_level_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeAction = (selectedOption) => {
        const values = this.state;
        values.form_shift_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeStartDate(date) {
        this.setState({ form_start_date: date });
    }

    handleChangeStartTime(time) {
        this.setState({ form_start_time: time });
    }

    handleChangeDuration(time) {
        this.setState({ form_duration: time });
    }

    clearForm() {
        this.setState({
            form_name: '',
            form_start_date: '',
            form_start_time: '',
            form_duration: '',
            form_visit_type_id: 0,
            form_user_id: 0,
            form_action_id: 0,
            form_school_id: 0,
            form_observations: ''
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
        const { id, name, start_date, start_time, duration, visit_type_id, user_id, action_id, school_id, observations } = element.value;

        this.setState({
            id: id,
            form_name: name,
            form_start_date: start_date,
            form_start_time: start_time,
            form_duration: duration,
            form_visit_type_id: visit_type_id,
            form_user_id: user_id,
            form_action_id: action_id,
            form_school_id: school_id,
            form_observations: observations,
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
        const { id, name, start_date, start_time, duration, visit_type_id, user_id, action_id, school_id, observations } = element.value;

        axios.put(`${apiSpartan}/${id}`, {
            'name': name,
            'start_date': start_date,
            'start_time': start_time,
            'duration': duration,
            'visit_type_id': visit_type_id,
            'user_id': user_id,
            'action_id': action_id,
            'school_id': school_id,
            'observations': observations,
            'active': true
        }).then(res => {
            this.onFetchData();
        }).catch(function (error) {
            console.log(error)
        }.bind(this));
    }

    handleChange(e) {
        console.log('handleChange', e)
        const target = e.currentTarget;

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submit_button_disabled: !this.form.isValid()
        });
    }

    submitForm(event) {
        event.preventDefault();

        const { form_name, form_start_date, form_start_time, form_duration, form_visit_type_id, form_user_id, form_action_id, form_school_id, form_observations } = this.state;

        axios.post(`${apiSpartan}`, {
            'name': form_name,
            'start_date': form_start_date,
            'start_time': form_start_time,
            'duration': form_duration,
            'visit_type_id': form_visit_type_id,
            'user_id': form_user_id,
            'action_id': form_action_id,
            'school_id': form_school_id,
            'observations': form_observations,
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
        const { id, form_name, form_start_date, form_start_time, form_duration, form_visit_type_id, form_user_id, form_action_id, form_school_id, form_observations } = this.state;

        axios.put(`${apiSpartan}/${id}`, {
            'name': form_name,
            'start_date': form_start_date,
            'start_time': form_start_time,
            'duration': form_duration,
            'visit_type_id': form_visit_type_id,
            'user_id': form_user_id,
            'action_id': form_action_id,
            'school_id': form_school_id,
            'observations': form_observations,
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
            { Header: "Nome", accessor: "name", headerClassName: 'text-left' },
            { Header: "Data início", accessor: "start_date", headerClassName: 'text-left' },
            { Header: "Hora início", accessor: "start_time", headerClassName: 'text-left' },
            { Header: "Duração", accessor: "duration", headerClassName: 'text-left' },
            { Header: "Tipo visita", accessor: "visit_type_id", headerClassName: 'text-left' },
            { Header: "Usuário", accessor: "user_id", headerClassName: 'text-left' },
            { Header: "Ação", accessor: "action_id", headerClassName: 'text-left' },
            { Header: "Observação", accessor: "observations", headerClassName: 'text-left' }
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
                    dados.map(item => {
                        item['value'] = item.id,
                            item['label'] = item.name
                    });
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

        let baseURL = `/${apiSpartan}?paginate=${pageSize}&page=${page}&filter[school_id]=${this.state.form_school_id}`;

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
        const { data, pageSize, page, loading, pages, columns, actions, visit_types, form_name, form_start_date, form_start_time, form_duration, form_visit_type_id, form_user_id, form_action_id, form_school_id, form_observations } = this.state;

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
                                        <Col md="6">
                                            <FormGroup for="form_name">
                                                <FormControlLabel htmlFor="form_name">Nome</FormControlLabel>
                                                <FormControlInput type="text" id="form_name" name="form_name" readOnly={false}
                                                    value={this.state.form_name} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_name">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2">
                                            <FormGroup for="form_start_date">
                                                <FormControlLabel htmlFor="form_start_date">Data início</FormControlLabel>
                                                <Flatpickr className="form-control"
                                                    value={form_start_date}
                                                    onChange={this.handleChangeStartDate} />
                                                <FieldFeedbacks for="form_start_date">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2">
                                            <FormGroup for="form_start_time">
                                                <FormControlLabel htmlFor="form_start_time">Hora início</FormControlLabel>
                                                <Flatpickr className="form-control"
                                                    data-enable-time
                                                    options={{ noCalendar: true, time_24hr: true }}
                                                    value={form_start_time}
                                                    onChange={this.handleChangeStartTime} />
                                                <FieldFeedbacks for="form_start_time">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="2">
                                            <FormGroup for="form_duration">
                                                <FormControlLabel htmlFor="form_duration">Duração</FormControlLabel>
                                                <Flatpickr className="form-control"
                                                    data-enable-time
                                                    options={{ noCalendar: true, time_24hr: true }}
                                                    value={form_duration}
                                                    onChange={this.handleChangeDuration} />
                                                <FieldFeedbacks for="form_duration">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup for="form_visit_type_id">
                                                <label>Tipo de visita</label>
                                                <Select
                                                    name="form_visit_type_id"
                                                    id="form_visit_type_id"
                                                    disabled={this.state.viewMode}
                                                    value={form_visit_type_id}
                                                    onChange={this.handleChangeVisitType}
                                                    options={visit_types}
                                                />
                                                <FieldFeedbacks for="form_visit_type_id">
                                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup for="form_action_id">
                                                <label>Ação</label>
                                                <Select
                                                    name="form_action_id"
                                                    id="form_action_id"
                                                    disabled={this.state.viewMode}
                                                    value={form_action_id}
                                                    onChange={this.handleChangeAction}
                                                    options={actions}
                                                />
                                                <FieldFeedbacks for="form_action_id">
                                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <FormGroup for="form_observations">
                                                <FormControlLabel htmlFor="form_observations">Observações</FormControlLabel>
                                                <FormControlInput type="textarea" rows="5" id="form_observations" name="form_observations" readOnly={false}
                                                    value={this.state.form_observations} onChange={this.handleChange}
                                                    required />
                                                <FieldFeedbacks for="form_observations">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
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

export default SchoolEventList;