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

const apiPost = 'school-secretary';
const apiSchool = 'school';

const apis = [
    { stateArray: 'data_shift', api: 'shift', field: 'form_shift' }
];

const selectsValidate = [
    { field: 'form_profile' },
    { field: 'form_unified' },
    { field: 'form_reunions' },
    { field: 'form_shift' }
];

moment.locale('pt-BR');

export default class SchoolMeeting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view_mode: this.props.viewMode,
            school_id: this.props.schoolId,

            submit_button_disabled: false,
            back_error: '',

            form_profile: 2,
            form_unified: null,
            form_reunions: null,
            form_shift: null,

            validate_form_profile: 1,
            validate_form_unified: 1,
            validate_form_reunions: 1,
            validate_form_shift: 1,

            data_profile: [{ value: 1, label: 'Descentralizado', field: 'form_profile' }, { value: 2, label: 'Unificado', field: 'form_profile' }],
            data_unified: [{ value: 1, label: 'Voto', field: 'form_unified' }, { value: 2, label: 'Decisão do gestor', field: 'form_unified' }],
            data_shift: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeReunions = this.handleChangeReunions.bind(this);
        this.sendValues = this.sendValues.bind(this);
    }

    componentDidMount() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let data = response.data.data;
                    data.map(ret => {
                        ret['value'] = ret.id,
                        ret['label'] = ret.name,
                        ret['field'] = item.field
                    });
                    this.setState({ [item.stateArray]: data });
                })
                .catch(function (error) {
                    let data_error = error.response.data.errors;
                    let filterId = Object.keys(data_error)[0].toString();
                    this.setState({ back_error: data_error[filterId] });
                }.bind(this)
                );
        });
    }

    componentWillMount() {
        this.checkPermission();

        if (this.state.school_id) {
            axios.get(`${apiSchool}/${this.state.school_id}`)
                .then(response => {
                    let secretary = response.data.data.secretary;

                    if (secretary) {
                        this.setState({
                            form_profile: secretary.choice_profile,
                            form_unified: secretary.unified_by,
                            form_reunions: formatDateToBrazilian(secretary.choice_reunions),
                            form_shift: secretary.shift_id
                        });
                    }
                })
                .catch(function (error) {
                    let data_error = error.response.data.errors;
                    let filterId = Object.keys(data_error)[0].toString();
                    this.setState({ back_error: data_error[filterId] });
                }.bind(this)
                );
        }
    }

    checkPermission() {
        canUser('school.update', this.props.history, "change", function (rules) {
            if (rules.length == 0) {
                this.setState({ view_mode: true, submit_button_disabled: true });
            }
        }.bind(this));
    }

    clearUnificate() {
        this.setState({
            form_unified: null,
            form_reunions: null,
            form_shift: null
        });
    }

    handleChange(target) {
        if (this.state[target.field] == target.value) return;

        this.setState({
            [target.field]: target.value,
            [`validate_${target.field}`]: 1,
            submit_button_disabled: false
        }, () => {
            if (this.validateFields()) this.setState({ submit_button_disabled: true });
        });
    }

    handleChangeReunions(selectedDates, dateStr, instance) {
        this.setState({ validate_form_reunions: 1, submit_button_disabled: false });

        this.setState({ form_reunions: dateStr }, () => {
            if (this.validateFields()) this.setState({ submit_button_disabled: true });
        });
    }

    validateFields() {
        this.setState({ back_error: '' });

        // Validate fields
        let stopSubmit = false;
        let contErrors = 0;
        selectsValidate.map(select => {
            let fieldValue = this.state[select.field];

            if (fieldValue === undefined || fieldValue == 0 || fieldValue == null || fieldValue == '') {
                this.setState({ [`validate_${select.field}`]: 0, submit_button_disabled: true });

                contErrors++;
            } else {
                this.setState({ [`validate_${select.field}`]: 1 });
            }
        });

        if (contErrors > 0) stopSubmit = true;

        return stopSubmit;
    }

    sendValues() {
        if (this.validateFields()) return;

        const { form_profile, form_unified, form_reunions, form_shift, school_id } = this.state;

        let params = {};
        params['school_id'] = parseInt(school_id);
        params['choice_profile'] = form_profile;

        if (form_profile == 2) {
            params['unified_by'] = form_unified;
            params['choice_reunions'] = formatDateToAmerican(form_reunions);
            params['shift_id'] = form_shift;
        }

        axios.post(`${apiPost}`, params)
            .then(res => {
                if (form_profile == 1) this.clearUnificate();

                alert('Dados salvos com sucesso!');
                this.setState({ submit_button_disabled: true });
            })
            .catch(function (error) {
                let data_error = error.response.data.errors;
                let filterId = Object.keys(data_error)[0].toString();
                this.setState({ back_error: data_error[filterId] });
            }.bind(this)
            );
    }

    render() {
        const {
            view_mode, back_error, form_profile, form_unified, form_reunions, form_shift, submit_button_disabled,
            validate_form_profile, validate_form_unified, validate_form_reunions, validate_form_shift,
            data_profile, data_unified, data_shift,
        } = this.state;

        return (
            <div>
                <div>
                    {back_error !== '' &&
                        <h4 className="alert alert-danger"> {back_error} </h4>
                    }
                    <Row>
                        <Col xl='3' md='3' sm='12' xs='12'>
                            <label>Perfil de escolha</label>
                            <Select
                                name="form_profile"
                                id="form_profile"
                                disabled={view_mode}
                                clearable={false}
                                value={form_profile}
                                onChange={this.handleChange}
                                options={data_profile}
                                placeholder="Selecione"
                            />
                            {validate_form_profile == 0 &&
                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                            }
                        </Col>
                        {form_profile == 2 &&
                            <Col xl='3' md='3' sm='12' xs='12'>
                                <label>Unificado por <strong style={{ color: 'red' }}>*</strong></label>
                                <Select
                                    name="form_unified"
                                    id="form_unified"
                                    disabled={view_mode}
                                    clearable={false}
                                    value={form_unified}
                                    onChange={this.handleChange}
                                    options={data_unified}
                                    placeholder="Selecione"
                                />
                                {validate_form_unified == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </Col>
                        }
                    </Row>
                    {form_profile == 2 &&
                        <Row>
                            <Col xl='3' md='3' sm='12' xs='12'>
                                <label>Perfil de escolha <strong style={{ color: 'red' }}>*</strong></label>
                                <Flatpickr
                                    disabled={view_mode}
                                    readOnly={true}
                                    className="form-control"
                                    options={{ minDate: 'today', dateFormat: 'd/m/Y' }}
                                    value={form_reunions}
                                    onChange={this.handleChangeReunions}
                                />
                                {validate_form_reunions == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </Col>

                            <Col xl='3' md='3' sm='12' xs='12'>
                                <label>Turno <strong style={{ color: 'red' }}>*</strong></label>
                                <Select
                                    name="form_shift"
                                    id="form_shift"
                                    disabled={view_mode}
                                    clearable={false}
                                    value={form_shift}
                                    onChange={this.handleChange}
                                    options={data_shift}
                                    placeholder="Selecione"
                                />
                                {validate_form_shift == 0 &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
                            </Col>
                        </Row>
                    }
                </div>
                <br />
                <div>
                    <Row>
                        <Col md="1">
                            <Button color='primary' onClick={this.sendValues} disabled={submit_button_disabled}><i className="fa fa-plus-circle"></i> Salvar</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )

    }

}