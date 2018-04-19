import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput, FormControl } from 'react-form-with-constraints-bootstrap4';
import ReactTable from 'react-table'
import Select from 'react-select';
import moment from 'moment';
import Flatpickr from 'react-flatpickr'

import 'flatpickr/dist/themes/material_blue.css'
import 'react-select/dist/react-select.css';
import 'react-table/react-table.css'

import axios from '../../common/axios';
const apiSpartan = 'event';

const apis = [
    { stateArray: 'visit_types', api: 'visit-type' },
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

            visit_types: [],
            actions: [],

            id: null,
            form_name: '',
            form_start_date: '',
            form_start_time: '',
            form_duration: '00:00:00',
            form_visit_type_id: 0,
            form_action_id: 0,
            form_school_id: this.props.schoolId,
            form_observations: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.closeColapse = this.closeColapse.bind(this);
        this.showButtonAction = this.showButtonAction.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeVisitType = this.handleChangeVisitType.bind(this);
        this.handleChangeAction = this.handleChangeAction.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleOpenStartTime = this.handleOpenStartTime.bind(this);

        this.formatedHour = this.formatedHour.bind(this);
        this.convertDate = this.convertDate.bind(this);
    }

    handleChangeVisitType = (selectedOption) => {
        const values = this.state;
        values.form_visit_type_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeAction = (selectedOption) => {
        const values = this.state;
        values.form_action_id = selectedOption.value;
        this.setState({ values });
    }

    handleChangeStartDate(selectedDates, dateStr, instance) {
        this.setState({ form_start_date: dateStr });
    }

    handleChangeStartTime(selectedDates, dateStr, instance) {
        this.setState({ form_start_time: dateStr + ':00' });
    }

    handleOpenStartTime(selectedDates, dateStr, instance) {
        if (this.state.new) {
            this.setState({ form_start_time: this.formatedHour(new Date()) });
        }
    }

    clearForm() {
        this.setState({
            form_name: '',
            form_start_date: '',
            form_start_time: '',
            form_visit_type_id: 0,
            form_action_id: 0,
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
        const { id, name, start_date, start_time, duration, visit_type_id, action_id, observations } = element.value;
        const values = this.state;

        values.id = id;
        values.form_name = name;
        values.form_start_date = start_date;
        values.form_start_time = start_time;
        values.form_visit_type_id = visit_type_id;
        values.form_action_id = action_id;
        values.form_observations = observations;
        values.blockButton = true;
        values.collapse = true;
        values.new = false;

        this.setState({ values });

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
        const { id, name, start_date, start_time, duration, visit_type_id, user_id, action_id, observations } = element.value;
        let school_id = element.value.school[0]['id'];

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
        const target = e.currentTarget;

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submit_button_disabled: !this.form.isValid()
        });
    }

    submitForm(event) {
        event.preventDefault();

        const { form_name, form_start_date, form_start_time, form_duration, form_visit_type_id, form_action_id, form_school_id, form_observations } = this.state;

        axios.post(`${apiSpartan}`, {
            'name': form_name,
            'start_date': form_start_date,
            'start_time': form_start_time,
            'duration': form_duration,
            'visit_type_id': form_visit_type_id,
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
        const { id, form_name, form_start_date, form_start_time, form_duration, form_visit_type_id, form_action_id, form_school_id, form_observations } = this.state;

        axios.put(`${apiSpartan}/${id}`, {
            'name': form_name,
            'start_date': form_start_date,
            'start_time': form_start_time,
            'duration': form_duration,
            'visit_type_id': form_visit_type_id,
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
            { Header: "Evento", accessor: "name", headerClassName: 'text-left' },
            { Header: "Data início", accessor: "start_date", headerClassName: 'text-left', Cell: (element) => (<span>{this.convertDate(element)}</span>) },
            { Header: "Hora início", accessor: "start_time", headerClassName: 'text-left' },
            { Header: "Tipo visita", accessor: "visit_type.name", headerClassName: 'text-left' },
            { Header: "Usuário", accessor: "user.name", headerClassName: 'text-left' },
            { Header: "Ação", accessor: "action.name", headerClassName: 'text-left' },
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
                Header: "Ações", accessor: "", sortable: false, width: 90, headerClassName: 'text-left', Cell: (element) =>
                    (
                        !element.value.deleted_at ?
                            <div className={this.showButtonAction(element)}>
                                <button className='btn btn-primary btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickEdit(element)}>
                                    <i className='fa fa-pencil'></i>
                                </button>

                                <button className='btn btn-danger btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickDelete(element)}>
                                    <i className='fa fa-ban'></i>
                                </button>
                            </div>
                            :
                            <div className={this.showButtonAction(element)}>
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

    convertDate(element) {
        let row = element.original;

        let arr = row.start_date.split('-');
        return `${arr[2]}/${arr[1]}/${arr[0]}`;
    }

    showButtonAction(element) {
        let row = element.original;

        let paramDate = parseInt(new Date(`${row.start_date} ${row.start_time}`).getTime());
        let nowDate = parseInt(new Date().getTime());

        let divClass = (nowDate < paramDate) ? '' : 'd-none';

        return divClass;
    }

    formatedHour(hour) {
        let h = new Date(hour);
        function pad(h) { return h < 10 ? '0' + h : h }
        return pad(h.getHours()) + ':'
            + pad(h.getMinutes()) + ':00';
    }

    onFetchData = (state, instance, deleted_at) => {
        let baseURL = `/school/${this.state.form_school_id}`;

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data.data.events

                this.setState({
                    data: dados
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { data, pageSize, page, loading, pages, columns, actions, visit_types, form_name, form_start_date, form_start_time, form_duration, form_visit_type_id, form_action_id, form_school_id, form_observations } = this.state;

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
                                                <FormControlLabel htmlFor="form_name">Evento</FormControlLabel>
                                                <FormControlInput
                                                    type="text"
                                                    id="form_name"
                                                    name="form_name"
                                                    readOnly={false}
                                                    value={this.state.form_name}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                                <FieldFeedbacks for="form_name">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="3">
                                            <FormGroup for="form_start_date">
                                                <FormControlLabel htmlFor="form_start_date">Data início</FormControlLabel>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{ minDate: 'today' }}
                                                    value={form_start_date}
                                                    onChange={this.handleChangeStartDate}
                                                    required
                                                />
                                                <FieldFeedbacks for="form_start_date">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="3">
                                            <FormGroup for="form_start_time">
                                                <FormControlLabel htmlFor="form_start_time">Hora início</FormControlLabel>
                                                <Flatpickr
                                                    className="form-control"
                                                    data-enable-time
                                                    options={{ noCalendar: true, time_24hr: true }}
                                                    value={form_start_time}
                                                    onChange={this.handleChangeStartTime}
                                                    onOpen={this.handleOpenStartTime}
                                                    required
                                                />
                                                <FieldFeedbacks for="form_start_time">
                                                    <FieldFeedback when="valueMissing">Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="4">
                                            <FormGroup for="form_visit_type_id">
                                                <FormControlLabel htmlFor="form_visit_type_id">Tipo de visita</FormControlLabel>
                                                <Select
                                                    name="form_visit_type_id"
                                                    id="form_visit_type_id"
                                                    disabled={this.state.viewMode}
                                                    value={form_visit_type_id}
                                                    onChange={this.handleChangeVisitType}
                                                    options={visit_types}
                                                    placeholder="Selecione..."
                                                    required
                                                />
                                                <FieldFeedbacks for="form_visit_type_id">
                                                    <FieldFeedback when={value => value == 0}>Este campo é de preenchimento obrigatório</FieldFeedback>
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup for="form_action_id">
                                                <FormControlLabel htmlFor="form_action_id">Ação</FormControlLabel>
                                                <Select
                                                    name="form_action_id"
                                                    id="form_action_id"
                                                    disabled={this.state.viewMode}
                                                    value={form_action_id}
                                                    onChange={this.handleChangeAction}
                                                    options={actions}
                                                    placeholder="Selecione..."
                                                    required
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
                                                <textarea
                                                    className="form-control"
                                                    rows="5"
                                                    id="form_observations"
                                                    name="form_observations"
                                                    readOnly={false}
                                                    value={this.state.form_observations}
                                                    onChange={this.handleChange}
                                                    required
                                                />
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
                                defaultPageSize={pageSize}
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