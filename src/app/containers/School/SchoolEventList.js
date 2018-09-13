import React, { Component } from 'react';
import { Card, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import ReactTable from 'react-table'
import Select from 'react-select';
import moment from 'moment';
import Flatpickr from 'react-flatpickr'
import { formatDateToBrazilian } from '../../../app/common/DateHelper';

import 'flatpickr/dist/themes/material_blue.css'
import 'react-select/dist/react-select.css';
import 'react-table/react-table.css'

import { canUser } from '../../common/Permissions';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { 
    addEventFlow, changeEventDateFlow, openStartTimeFlow, changeTimeFlow,
    getEventActionsFlow, changeEventActionFlow, loadEventsFlow,
    deleteSchoolEventFlow, activeSchoolEventFlow, findSchoolEventFlow,
    updateSchoolEventFlow, insertSchoolEventFlow, unloadSchoolEvent
} from '../../../actions/event'

moment.locale('pt-BR');

// Our validation function for `name` field.
const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório');

const validate = values => {
    const errors = {};
    return errors;
}

class SchoolEventList extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        addEventFlow: PropTypes.func.isRequired,
        changeEventDateFlow: PropTypes.func.isRequired,
        changeTimeFlow: PropTypes.func.isRequired,
        getEventActionsFlow: PropTypes.func.isRequired,
        changeEventActionFlow: PropTypes.func.isRequired,
        loadEventsFlow: PropTypes.func.isRequired,
        deleteSchoolEventFlow: PropTypes.func.isRequired,
        activeSchoolEventFlow: PropTypes.func.isRequired,
        findSchoolEventFlow: PropTypes.func.isRequired,
        insertSchoolEventFlow: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleOpenStartTime = this.handleOpenStartTime.bind(this);
        this.handleChangeAction = this.handleChangeAction.bind(this);
        this.formatedHour = this.formatedHour.bind(this);
        this.showButtonAction = this.showButtonAction.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickActive = this.onClickActive.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.submit = this.submit.bind(this);
    }

    showButtonAction(element) {
        let row = element.original;

        let paramDate = parseInt(new Date(`${row.start_date} ${row.start_time}`).getTime());
        let nowDate = parseInt(new Date().getTime());

        let divClass = (nowDate < paramDate) ? '' : 'd-none';

        return divClass;
    }

    onClickDelete(element) {
        const { id } = element.value;
        const user = this.props.user;
        const schoolInfo = this.props.school;
        const schoolId = schoolInfo.id;

        this.props.deleteSchoolEventFlow(user, id, schoolId);
    }

    onClickEdit(element) {
        const { id } = element.value;
        const eventInfo = element.value;

        this.props.findSchoolEventFlow(eventInfo);
    }

    onClickActive(element) {
        const { id } = element.value;
        const user = this.props.user;
        const schoolInfo = this.props.school;
        const schoolId = schoolInfo.id;

        this.props.activeSchoolEventFlow(user, element, id, schoolId);
    }

    componentWillReceiveProps(nextProps) {
        const schoolType = this.props.schoolType;
        const schoolInfo = this.props.schoolInfo;
        const user = nextProps.user;

        if (schoolType !== nextProps.schoolType) {
            const identify = nextProps.schoolType.identify;
            this.props.reset(); 
            this.props.getEventActionsFlow(user, identify);
        }

        if (schoolInfo !== nextProps.school && !this.props.school.events) {
            const events = nextProps.school.events;
            this.props.loadEventsFlow(user, events);
        }
        
    }

    onClickAdd() {
        const event = this.props.eventSchool;
        const collapse = event.collapse;
        this.props.reset();
        this.props.unloadSchoolEvent();
        this.props.addEventFlow(collapse);
    }

    formatedHour(hour) {
        let h = new Date(hour);
        function pad(h) { return h < 10 ? '0' + h : h }
        return pad(h.getHours()) + ':'
            + pad(h.getMinutes()) + ':00';
    }

    renderTextAreaInput = ({ input, type, disabled, valueOption ,meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <textarea
                className="form-control"
                {...input}
                rows={5}
                disabled={disabled}
                // value={valueOption}
            >
            </textarea>
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>

    )

    renderDateInput = ({ input, type, disabled, valueOption, onChangeFunction ,meta: { touched, error } }) => (
        <div>
            <Flatpickr
                className="form-control"
                options={{ minDate: 'today' }}
                value={valueOption}
                onChange={onChangeFunction}      
            />

            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderTimeInput = ({ input, type, disabled, valueOption, onChangeFunction , onOpenFunction,meta: { touched, error } }) => (
        <div>
            <Flatpickr
                className="form-control"
                data-enable-time
                options={{ noCalendar: true, time_24hr: true }}
                value={valueOption}
                onChange={onChangeFunction}     
                onOpen={onOpenFunction} 
            />

            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderSelectInput = ({ input, name, valueOption, options, labelKey, valueKey, disabled, onChangeFunction ,meta: { touched, error } }) => (
        <div className="form-group group-select">
            <Select
                {...input}
                name={name}
                id={name}
                disabled={disabled}
                value={valueOption}
                onChange={onChangeFunction}
                options={options}
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

    handleChangeStartDate(selectedDates, dateStr, instance) {
        this.props.changeEventDateFlow(dateStr);
    }

    handleChangeStartTime(selectedDates, dateStr, instance) {
        const formStartTime = dateStr + ':00';
        this.props.changeTimeFlow(formStartTime);
    }

    handleOpenStartTime() {
        const actualTime = this.formatedHour(new Date());
        this.props.openStartTimeFlow(actualTime);
    }

    handleChangeAction(selectedOption) {
        this.props.changeEventActionFlow(selectedOption);
    }

    submit(eventObject) {
        const { user, reset } = this.props
        const { id, name } = this.props.school;
        const eventSchool = this.props.eventSchool;
        const { collapse, dateStr, formStartTime, actions, actionId, schoolEvents } = this.props.eventSchool;
        const eventInfo = eventSchool.eventInfo;

        if (dateStr && formStartTime && actionId) {
            const savedObject = {
                action_id: actionId.value,
                active: true,
                duration: "00:00:00",
                name: name,
                observations: eventObject.observations,
                school_id: id,
                start_date: dateStr,
                start_time: formStartTime,
                visit_type_id: 1
            };

            if (eventInfo.id) {
                this.props.updateSchoolEventFlow(user, savedObject, eventInfo.id, id);
            } else {
                this.props.insertSchoolEventFlow(user, savedObject, id);
            }
        }

    }

    render() {
        const { collapse, dateStr, formStartTime, actions, actionId, schoolEvents
        
        } = this.props.eventSchool;

        const {
            handleSubmit,
        } = this.props;

        return (
            <div>
                <div>
                    <Collapse isOpen={collapse}>
                    
                        <Card>
                            <CardBody>
                            <form onSubmit={handleSubmit(this.submit)}>
                                    <Row>
                                        <Col md="3">
                                            <div className="form-group">
                                                <label htmlFor="form_start_date">
                                                    Data de Início 
                                                    <span className="text-danger"><strong>*</strong></span>
                                                </label>
                                                <Field
                                                    name="form_start_date"
                                                    disabled={true}
                                                    valueOption={dateStr}
                                                    onChangeFunction={this.handleChangeStartDate}      
                                                    component={this.renderDateInput}
                                                />
                                                {!dateStr &&
                                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                                }
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="form-group">
                                                <label htmlFor="form_start_time">
                                                    Horário de Início 
                                                    <span className="text-danger"><strong>*</strong></span>
                                                </label>
                                                <Field
                                                    name="form_start_time"
                                                    disabled={true}
                                                    valueOption={formStartTime}
                                                    onChangeFunction={this.handleChangeStartTime}      
                                                    onOpenFunction={this.handleOpenStartTime}
                                                    component={this.renderTimeInput}
                                                    // validate={fieldRequired}
                                                />
                                                {!formStartTime &&
                                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                                }
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <label htmlFor="form_visit_type_id">
                                                Tipo de visita <span className="text-danger"><strong>*</strong></span>
                                            </label>
                                            <Field
                                                name="form_visit_type_id"
                                                options={[
                                                    {value: 1, label: "Comercial"}
                                                ]}
                                                disabled={true}
                                                placeholder="Selecione..."
                                                valueOption={1}
                                                component={this.renderSelectInput}
                                            />
                                        </Col>
                                        <Col md="3">
                                            <label htmlFor="form_action_id">
                                                Ação <span className="text-danger"><strong>*</strong></span>
                                            </label>
                                            <Field
                                                name="form_action_id"
                                                options={actions}
                                                onChangeFunction={this.handleChangeAction}
                                                placeholder="Selecione..."
                                                valueOption={actionId}
                                                component={this.renderSelectInput}
                                                // validate={actionRequired}
                                            />
                                            {!actionId &&
                                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                            }
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="12">
                                                <label htmlFor="observations">
                                                    Observações 
                                                    <span className="text-danger"><strong>*</strong></span>
                                                </label>
                                                <Field
                                                    name="observations"
                                                    id="observations"
                                                    validate={fieldRequired}
                                                    component={this.renderTextAreaInput}
                                                />
                                        </Col>
                                    </Row>                            
                                    <br />
                                    <div>
                                        <Row>
                                            <Col md="1">
                                                <button className="btn btn-primary">
                                                <i className="fa fa-plus-circle"></i> 
                                                    Salvar
                                                </button>
                                            </Col>
                                            <Col md="1">
                                                <Button color='danger' onClick={() => this.onClickAdd()}><i className="fa fa-plus-circle"></i> Cancelar</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </form>
                                
                            </CardBody>
                        </Card>
                       
                    </Collapse>
                    <Row>
                        <Col md="2">
                            <Button type="button" color='primary' onClick={() => this.onClickAdd()}
                                disabled={collapse?true:false}
                                >
                                <i className="fa fa-plus-circle"></i> 
                                Adicionar
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="12">
                            <div className="event-grid">
                                <ReactTable
                                    columns={
                                        [
                                            {
                                                expander: true,
                                                Header: "Observações",
                                                headerClassName: 'text-left',
                                                width: 96,
                                                Expander: ({ isExpanded, ...rest }) =>
                                                    <div>
                                                    {isExpanded
                                                        ? <span>&#x2296;</span>
                                                        : <span>&#x2295;</span>}
                                                    </div>,
                                                style: {
                                                    cursor: "pointer",
                                                    fontSize: 25,
                                                    padding: "0",
                                                    textAlign: "center",
                                                    userSelect: "none"
                                                },
                                            },
                                            { Header: "Data início", accessor: "start_date", headerClassName: 'text-left', 
                                                Cell: (element) => (<span>{formatDateToBrazilian(element.original.start_date)}</span>) 
                                            },
                                            { Header: "Hora início", accessor: "start_time", headerClassName: 'text-left' },
                                            { Header: "Tipo visita", accessor: "visit_type.name", headerClassName: 'text-left' },
                                            { Header: "Usuário", accessor: "user.name", headerClassName: 'text-left' },
                                            { Header: "Ação", accessor: "action.name", headerClassName: 'text-left' },
                                            
                                            
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
                                                )
                                            },
                                            {
                                                Header: "Ações", accessor: "", sortable: false, width: 90, headerClassName: 'text-left', Cell: (element) =>
                                                    (
                                                        !element.value.deleted_at ?
                                                            <div className={this.showButtonAction(element)}>
                                                                <button className='btn btn-primary btn-sm' onClick={() => this.onClickEdit(element)}>
                                                                    <i className='fa fa-pencil'></i>
                                                                </button>
                                
                                                                <button className='btn btn-danger btn-sm' onClick={() => this.onClickDelete(element)}>
                                                                    <i className='fa fa-ban'></i>
                                                                </button>
                                                            </div>
                                                            :
                                                            <div className={this.showButtonAction(element)}>
                                                                <button className='btn btn-success btn-sm' onClick={() => this.onClickActive(element)}>
                                                                    <i className='fa fa-check-circle'></i>
                                                                </button>
                                                            </div>
                                                    )
                                            }
                                        ]
                                    }
                                    SubComponent={row => {
                                        let school = row.original;
                
                                        return (
                                            <div style={{ padding: "20px" }}>
                                                <b style={{ marginLeft: '20px' }}>Observação:</b> {school.observations}
                                            </div>
                                        );
                                    }}
                                    data={schoolEvents}
                                    defaultPageSize={10}
                                    loadingText='Carregando...'
                                    noDataText='Sem registros'
                                    ofText='de'
                                    rowsText=''
                                    className='-striped -highlight'
                                />
                            </div>
                        </Col>
                    </Row>
                    <br />
                </div>
            </div>
        )
    }
}

let SchoolEventForm = reduxForm({
    form: 'SchoolEventForm',
    enableReinitialize: true,
    validate
})(SchoolEventList)

const functions_object = {
    addEventFlow,
    changeEventDateFlow,
    openStartTimeFlow,
    changeTimeFlow,
    getEventActionsFlow,
    changeEventActionFlow,
    loadEventsFlow,
    deleteSchoolEventFlow,
    activeSchoolEventFlow,
    findSchoolEventFlow,
    updateSchoolEventFlow,
    insertSchoolEventFlow,
    unloadSchoolEvent
};

SchoolEventForm = connect(
    state => ({
        user: state.user,
        eventSchool: state.event,
        initialValues: state.event.eventInfo
    }),
    functions_object
)(SchoolEventForm)


export default SchoolEventForm