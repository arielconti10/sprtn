import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import { Button, Row, Col } from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { canUser } from '../../common/Permissions';
import { formatDateToAmerican, formatDateToBrazilian } from '../../common/DateHelper'

import 'flatpickr/dist/themes/material_blue.css'
import 'react-select/dist/react-select.css';

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import {
    setMeetingProfileFlow, setMeetingUnifiedFlow, changeMeetingDateFlow,
    loadMeetingShiftsFlow, changeMeetingShiftFlow, insertSchoolMeetingFlow,
    unloadSchoolMeeting, setMeetingSubmited
} from '../../../actions/meeting'

const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório');

const validate = values => {
    const errors = {};

    return errors;
}

class SchoolMeeting extends Component {
    static propTypes = {
        setMeetingProfileFlow: PropTypes.func,
        setMeetingUnifiedFlow: PropTypes.func,
        handleChangeDate: PropTypes.func,
        changeMeetingDateFlow: PropTypes.func,
        loadMeetingShiftsFlow: PropTypes.func,
        changeMeetingShiftFlow: PropTypes.func,
        insertSchoolMeetingFlow: PropTypes.func,
        unloadSchoolMeeting: PropTypes.func,
        setMeetingSubmited: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeUnified = this.handleChangeUnified.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeShift = this.handleChangeShift.bind(this);
        this.submit = this.submit.bind(this);
    }

    submit = (meeting) => {
        const { profileId, unifiedId, meetingDate, shiftId } = this.props.meeting;

        this.props.setMeetingSubmited();

        if (unifiedId && meetingDate && shiftId) {
            const { schoolId } = this.props;
            const user = this.props.user;

            const objectSave = {
                school_id: schoolId,
                choice_profile: profileId.value,
                unified_by: unifiedId.value,
                choice_reunions: formatDateToAmerican(meetingDate),
                shift_id: shiftId.value
            };

            this.props.insertSchoolMeetingFlow(user, objectSave);
            this.props.unloadSchoolMeeting();
        }


    }

    componentWillMount() {
        const user = this.props.user;
        this.props.loadMeetingShiftsFlow(user);
    }

    renderNameInput = ({ input, type, disabled, valueOption ,meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
                disabled={disabled}
                // value={valueOption}
            />
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
                options={{ minDate: 'today', dateFormat: 'd/m/Y' }}
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

    renderSelectInput = ({ input, name, valueOption, options, labelKey, valueKey, onChangeFunction, clearable ,meta: { touched, error } }) => (
        <div className="form-group group-select">
            <Select
                {...input}
                name={name}
                id={name}
                clearable={clearable}
                isClearable={clearable}
                // disabled={this.state.viewMode}
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

    handleChange(selectedOption) {
        this.props.setMeetingProfileFlow(selectedOption);
    }

    handleChangeUnified(selectedOption) {
        this.props.setMeetingUnifiedFlow(selectedOption);
    }

    handleChangeDate(selectedDates, dateStr, instance) {
        this.props.changeMeetingDateFlow(dateStr);
    }

    handleChangeShift(selectedOption) {
        this.props.changeMeetingShiftFlow(selectedOption);
    }

    render() {
        const {
            handleSubmit,
        } = this.props;

        const { profileId, unifiedId, meetingDate, shifts, shiftId, submited } = this.props.meeting;

        return (
            <div>
                <form onSubmit={handleSubmit(this.submit)}>
                    <Row>
                        <Col xl='3' md='3' sm='12' xs='12'>
                            <label>Perfil de Escolha</label>
                            <Field
                                name="form_profile"
                                id="form_profile"
                                clearable={false}
                                options={[
                                    { value: 1, label: 'Descentralizado', field: 'form_profile' },
                                    { value: 2, label: 'Unificado', field: 'form_profile' }
                                ]}
                                onChangeFunction={this.handleChange}
                                placeholder="Selecione..."
                                valueOption={profileId}
                                component={this.renderSelectInput}
                            />
                        </Col>
                        {profileId.value === 2 &&
                        <Col xl='3' md='3' sm='12' xs='12'>
                            <label>Unificado por <strong style={{ color: 'red' }}>*</strong></label>
                            <Field
                                name="form_unified"
                                id="form_unified"
                                options={[
                                    { value: 1, label: 'Voto' },
                                    { value: 2, label: 'Decisão do gestor' }
                                ]}
                                onChangeFunction={this.handleChangeUnified}
                                placeholder="Selecione..."
                                valueOption={unifiedId}
                                component={this.renderSelectInput}
                            />
                            {(submited == 1 && !unifiedId) &&
                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                            }
                        </Col>
                        }
                    </Row>
                    {profileId.value === 2 &&
                    <Row>
                        <Col xl='3' md='3' sm='12' xs='12'>
                            <label htmlFor="profile_choose">
                                Data
                                <span className="text-danger"><strong>*</strong></span>
                            </label>
                            <Field
                                name="profile_choose"
                                disabled={true}
                                valueOption={meetingDate}
                                onChangeFunction={this.handleChangeDate}
                                component={this.renderDateInput}
                            />
                            {(submited == 1 && !meetingDate) &&
                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                            }
                        </Col>
                        <Col xl='3' md='3' sm='12' xs='12'>
                            <label htmlFor="profile_choose">
                                Turno
                                <span className="text-danger"><strong>*</strong></span>
                            </label>
                            <Field
                                name="form_shift"
                                id="form_shift"
                                options={shifts}
                                onChangeFunction={this.handleChangeShift}
                                placeholder="Selecione..."
                                valueOption={shiftId}
                                component={this.renderSelectInput}
                            />
                            {(submited == 1 && !shiftId) &&
                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                            }
                        </Col>
                    </Row>
                    }
                    <br />
                    <div>
                        <Row>
                            <Col md="1">
                                <Button color='primary' disabled={profileId.value !== 2?true:false} >
                                    <i className="fa fa-plus-circle"> </i>
                                     Salvar
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </form>
                <br />

            </div>
        )
    }
}

let SchoolMeetingForm = reduxForm({
    form: 'SchoolMeetingForm',
    enableReinitialize: true,
    validate
})(SchoolMeeting)

const functions_object = {
    setMeetingProfileFlow,
    setMeetingUnifiedFlow,
    changeMeetingDateFlow,
    loadMeetingShiftsFlow,
    changeMeetingShiftFlow,
    insertSchoolMeetingFlow,
    unloadSchoolMeeting,
    setMeetingSubmited
};

SchoolMeetingForm = connect(
    state => ({
        meeting : state.meeting,
        user: state.user
    }),
    functions_object
)(SchoolMeetingForm)

export default SchoolMeetingForm