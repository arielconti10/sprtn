import React, { Component } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import axios from '../../../app/common/axios';
import { formatNumber } from '../../../app/common/FormatHelper';
import { mapPieChart } from '../../../app/common/ChartHelper';

import { canUser } from '../../common/Permissions';
import IndicatorNumber from './IndicatorNumber';
import './Indicators.css';
import classnames from 'classnames';
import PieChartComponent from './PieChartComponent';

class Indicators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active_tab: 'chart_actions',
            total_schools: '00',
            total_students: '00',
            total_contacts: '00',
            total_action: '00',
            data_actions: [],
            data_school_type: [],
            data_student_type: [],
            data_action_type: [],
            data_student_level: [],
            data_coverage: [],
            options_publisher: { pieHole: 0.2, is3D: false, 
                sliceVisibilityThreshold: 0,
                chartArea: {  width: "100%", height: "70%" },
                legend: { 
                    // position : 'bottom',
                    alignment: 'center'
                } 
            },
            msg_error: ''

        };

        this.getActionsRealized = this.getActionsRealized.bind(this);
    }

    //o "callback hell" será aprimorado após estudo de promises
    //foi utilizado por ser assíncrono, e se chamado de modo síncrono, nāo produz os valores desejados
    componentWillMount() {
        canUser('indicator.view', this.props.history, "view");
        this.requestTotal("indicator/school/total", "total_schools", function () {
            this.requestTotal("indicator/student/total", "total_students", function () {
                this.requestTotal("indicator/school/contact", "total_contacts", function () {
                    this.requestTotal("indicator/action/total", "total_action", function () { });
                });
            });
        });

        this.getActionsRealized();
        this.getSchoolTypes();
        this.getStudentTypes();
        this.getActionTypes();
        this.getStudentLevel();
        this.getCoverage();
    }

    toggle(tab) {
        if (this.state.active_tab !== tab) {
            this.setState({
                active_tab: tab
            });
        }
    }

    /**
     * obtem a cobertura da carteira
     */
    getCoverage() {
        const action = "indicator/action/year";
        axios.get(action)
            .then(res => {
                const result = res.data.data;
                if (result.length > 0) {
                    const actual_year = (new Date()).getFullYear();

                    const results_year = result.find(function (item) {
                        return item.year === actual_year
                    });

                    const not_coverage = this.state.total_schools - results_year.total;

                    const array_chart = [
                        { "name": "Coberto", "total": results_year.total },
                        { "name": "Nāo Coberto", "total": not_coverage },
                    ];

                    const data_coverage = mapPieChart("Ações", "name", "total", array_chart);
                    this.setState({ data_coverage });
                } else {
                    const array_chart = [];
                    const data_coverage = mapPieChart("Ações", "name", "total", array_chart);
                    this.setState({ data_coverage });
                }
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    /**
     * obtem o total de ações realizadas pelo usuário
     */
    getActionsRealized() {
        const action = "indicator/school/action";
        axios.get(action)
            .then(res => {
                const result = res.data.data;
                const data_actions = mapPieChart("Ações", "name", "total", result);
                this.setState({ data_actions });
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    /**
     * obtem o total de tipos de escolas, separadas por público, privado e secretaria
     */
    getSchoolTypes() {
        const action = "indicator/school/type";
        axios.get(action)
            .then(res => {
                const result = res.data.data;
                const data_school_type = mapPieChart("Tipos de Escola", "school_type", "total", result);
                this.setState({ data_school_type });
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    /**
     * obtem o total de alunos, separadas por tipos de escola: público, privado e secretaria
     */
    getStudentTypes() {
        const action = "indicator/student/school-type";
        axios.get(action)
            .then(res => {
                const result = res.data.data.total;
                const data_student_type = mapPieChart("Tipos de Escola", "school_type", "total", result);
                this.setState({ data_student_type });
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    /**
     * obtem o total de ações, separadas por tipos de escola: público, privado e secretaria
     */
    getActionTypes() {
        const action = "indicator/action/school-type";
        axios.get(action)
            .then(res => {
                const result = res.data.data;
                const data_action_type = mapPieChart("Tipos de Escola", "school_type", "total", result);
                this.setState({ data_action_type });
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    /**
     * obtem o total de estudantes separados por nível. Exemplo: Ensino Fundamental I, Ensino Fundamental II
     */
    getStudentLevel() {
        const action = "indicator/student/level";
        axios.get(action)
            .then(res => {
                const result = res.data.data;
                const data_student_level = mapPieChart("Tipos de Escola", "name", "total", result);
                this.setState({ data_student_level });
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    /**
     * obtém o total e retorna, para que seja possiível atribuir o estado
     * a funçāo foi criada devido ao retorno dos totais nos endpoints serem similares
     * @param { Object } result objeto com o resultado obtido
     * @return { Float } total_format total formatado
     */
    getTotal(result_json) {
        const result = result_json.data.data;
        let total = '00';

        if (result.total) {
            total = parseInt(result.total);
        }

        if (result_json.data && !result.total) {
            total = parseInt(result);
        }

        const total_format = formatNumber(total);

        return total_format;
    }

    /**
     * captura o total de acordo com a URL e o estado a ser alterado
     * @param { String } action url de total que será consultada 
     * @param { String } state_attribute estado que será atualizado 
     */
    requestTotal(action, state_attribute, callback) {
        axios.get(action)
            .then(res => {
                const total_format = this.getTotal(res);

                this.setState({
                    [state_attribute]: total_format,
                }, callback);
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })

        return true;
    }

    render() {
        const { total_schools, total_students, total_contacts, total_action,
            data_actions, data_school_type, data_student_type, data_action_type, data_student_level,
            data_coverage,
            options_publisher
        } = this.state;

        return (
            <div>
                {this.state.msg_error !== '' &&
                    <h4 className="alert alert-danger"> {this.state.msg_error} </h4>
                }

                <div className="row indicators-numbers justify-content-md-center">
                    <IndicatorNumber
                        cols="col-12 col-sm-6 col-lg-3"
                        backgroundColor="bg-info"
                        shadowClass="school shadow"
                        icon="fa fa-building-o"
                        total={total_schools}
                        label="Escolas"
                    />

                    <IndicatorNumber
                        cols="col-12 col-sm-6 col-lg-3"
                        backgroundColor="bg-success"
                        shadowClass="students shadow"
                        icon="fa fa-users"
                        total={total_students}
                        label="Alunos"
                    />

                    <IndicatorNumber
                        cols="col-12 col-sm-6 col-lg-3"
                        backgroundColor="bg-primary"
                        shadowClass="contacts shadow"
                        icon="fa fa-book"
                        total={total_contacts}
                        label="Contatos"
                    />

                    <IndicatorNumber
                        cols="col-12 col-sm-6 col-lg-3"
                        backgroundColor="bg-warning"
                        shadowClass="actions shadow"
                        icon="fa fa-bullseye"
                        total={total_action}
                        label="Acões"
                    />

                </div>

                <div className="row">
                    {data_actions.length > 1 &&
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="chart-actions ">
                            <PieChartComponent
                                data_actions={data_actions}
                                chart_id="pie_actions"
                                options_publisher={options_publisher}
                                label_card="Ações Realizadas"
                            />
                        </div>
                    </div>
                    }

                    {data_action_type.length > 1 &&
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="chart-actions-type ">
                            <PieChartComponent
                                data_actions={data_action_type}
                                chart_id="pie_actions_type"
                                options_publisher={options_publisher}
                                label_card="Ações por tipo de escola"
                            />
                        </div>
                    </div>
                    }

                    {data_coverage.length > 1 &&
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="tab-data">
                            <div className="coverage-school">
                                <PieChartComponent
                                    data_actions={data_coverage}
                                    chart_id="pie_coverage"
                                    options_publisher={options_publisher}
                                    label_card="Cobertura da Carteira"
                                />
                            </div>
                        </div>
                    </div>
                    }

                    {data_school_type.length > 1 &&
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="tab-data">
                            <div className="chart-school-types ">
                                <PieChartComponent
                                    data_actions={data_school_type}
                                    chart_id="pie_school_types"
                                    options_publisher={options_publisher}
                                    label_card="Escolas por Tipo"
                                />
                            </div>
                        </div>
                    </div>
                    }

                    {data_student_type.length > 1 &&
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="tab-data">
                            <div className="chart-student-types ">
                                <PieChartComponent
                                    data_actions={data_student_type}
                                    chart_id="pie_student_types"
                                    options_publisher={options_publisher}
                                    label_card="Alunos por tipo de escola"
                                />
                            </div>
                        </div>
                    </div>
                    }

                    {data_student_level.length > 1 &&
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="tab-data">
                            <div className="chart-student-level ">
                                <PieChartComponent
                                    data_actions={data_student_level}
                                    chart_id="pie_student_level"
                                    options_publisher={options_publisher}
                                    label_card="Alunos por nível"
                                />
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default Indicators;