import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import { formatNumber } from '../../../app/common/FormatHelper';
import { mapPieChart } from '../../../app/common/ChartHelper';

import IndicatorNumber from './IndicatorNumber';
import './Indicators.css';
import PieChartComponent from './PieChartComponent';
import { Async } from 'react-select';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import Select from 'react-select';

class Indicators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active_tab: 'chart_actions',
            total_schools: '00',
            total_students: '00',
            total_contacts: '00',
            total_action: '00',
            school_types: [],
            search_options: [],
            school_type_id: '',
            action_type_initial: [],
            actions_initial: [],
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
            ring_load: false,
            ring_load_change: false,
            msg_error: ''

        };

        this.handleChangeSchoolType = this.handleChangeSchoolType.bind(this);
        this.getActionsRealized = this.getActionsRealized.bind(this);
    }

    //o "callback hell" será aprimorado após estudo de promises
    //foi utilizado por ser assíncrono, e se chamado de modo síncrono, nāo produz os valores desejados
    componentDidMount() {
        this.setState( { ring_load : true });

        this.setState({school_type_id: [
            { "value": "PARTICULAR", "label": "Particular" },
            { "value": "PUBLICO", "label": "Público" },
            { "value": "SECRETARIA", "label": "Secretaria" }
        ]});
        // canUser('indicator.view', this.props.history, "view");
        this.requestTotal("indicator/school/contact", "total_contacts", function () {
            this.requestTotal("indicator/action/total", "total_action", function () { 
                this.getCoverage();
            });
        });

        this.getActionsRealized();
        this.getSchoolTypes();
        this.getStudentTypes();
        this.getActionTypes();
        this.getStudentLevel();    
        
        // this.setState({ ring_load : false });
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

                    const total_schools = this.state.total_schools.replace(/\./g,'');

                    const not_coverage = parseFloat(total_schools) - parseFloat(results_year.total);

                    const array_chart = [
                        { "name": "Coberto", "total": parseFloat(results_year.total) },
                        { "name": "Nāo Coberto", "total": not_coverage },
                    ];

                    return array_chart;
                } else {
                    const array_chart = [];
                    return array_chart;
                }
            })
            .then(chart_return => {
                const data_coverage = mapPieChart("Ações", "name", "total", chart_return);
                this.setState({ data_coverage });

                
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

                this.setState({ data_actions, actions_initial: data_actions });
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

                this.groupBySchool(this.state.school_type_id, data_school_type, "data_school_type", "total_schools");
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

                this.groupBySchool(this.state.school_type_id, data_student_type, "data_student_type", "total_students");
                this.setState ( { ring_load : false });
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

                this.setState({ data_action_type, action_type_initial: data_action_type });
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


    /**
     * realiza o cálculo do total de ações realizadas
     * @param {Array} actions lista com as actions encontradas
     * @return {Float} total total de ações filtradas
     */
    getTotalActions(actions) {
        const total = actions.reduce( (accum, current) => accum + current.total, 0);
        return total;
    }

    /**
     * realiza a listagem de tipos de escola e respectivos totais, em um array de objetos
     * @param {Array} school_type_id IDs de escolas selecionados
     * @param {Array} types tipos encontrados na busca
     * @return void 
     */
    listTotalActions(school_type_id, types) {
        const total_array = [];
        const tmp_array = [];
        const action_array = [];
        const old_state = this.state.action_type_initial;
        const old_action = this.state.actions_initial;

        school_type_id.map(item => {
            const actions = types[item.value];
            const total_actions = this.getTotalActions(actions);  
            const total_object = { "school_type" : item.value, "total" : total_actions};  
            total_array.push(total_object);
            tmp_array.push(actions);
        });

        tmp_array.map(item => item.map(action => {
                action_array.push(action);
            })
        )

        const total_general = total_array.reduce( (accum, current) => accum + current.total, 0);

        const data_action_type = mapPieChart("Tipos de Escola", "school_type", "total", total_array);
        const chart_actions = mapPieChart("Ações Realizadas", "action", "total", action_array);
        this.setState({ data_action_type, data_actions: chart_actions,  total_action: total_general }, function() {
            if (this.state.data_action_type.length === 1) {
                this.setState( { data_action_type : old_state, data_actions: old_action });
                return true;
            }
        });
    }

    /**
     * obtem o total de ações de acordo com o tipo de escola
     * @param {String} school_type_id tipo de escola, por exemplo: "público", "particular" ou "secretaria"
     */
    getActionsBySchool(school_type_id) {
        this.setState({ ring_load : true });
        axios.get("indicator/action/type/school-type")
        .then(res => {
            const data_general = res.data.data;
            const types = data_general.school_type;

            this.listTotalActions(school_type_id, types);
            this.setState({ ring_load_change : false });

        })
    }

    /**
     * obtem o total de ações de acordo com o tipo de escola
     * @param {String} school_type_id tipo de escola, por exemplo: "público", "particular" ou "secretaria"
     * @param {String} selector seletor a ser atualizado, por exemplo: "total_schools"
     * @param {String} selector_sum atributo a ser somado, por exemplo: "data_school_type"
     */
    sumBySchool(school_type_id, selector, selector_sum) {
        let general_total = 0;
        const types = this.state[selector_sum];

        types.map(item => {
            school_type_id.map(item_filter => {
                if (item_filter.value.indexOf(item[0]) !== -1) {
                    general_total = general_total + parseFloat(item[1]);
                }
            })

        });

        this.setState( { [selector]: formatNumber(general_total) } );
    }

    /**
     * agrupa as categorias e totais de escola
     */
    groupBySchool(selected, types, selector, selector_total = "") {
        const final_array = [];
        final_array[0] = ["LEGENDA", "%"];
        types.map(item => {
            selected.map(item_search => {
                if (item_search.value.indexOf(item[0]) !== -1) {
                    final_array.push(item);
                }
            })
        })

        const general_total = final_array.reduce( (accum, curr) => curr[1] !== '%'?accum + curr[1]:0, 0 );
        this.setState( { [ selector_total ]: formatNumber(general_total) } );


        if (final_array.length > 1) {
            this.setState( { [selector] : final_array });
        }

        
    }

    handleChangeSchoolType (selectedOption) {
        this.setState( {ring_load_change : true });
        const values = this.state;
        if(selectedOption.length > 0) {
            values.school_type_id = selectedOption;
            this.setState({ values }, () => {
                if (this.state.school_type_id.length === 0) {
                    this.setState( {
                        'data_actions': [],
                        'data_action_type': [],
                        'data_coverage': [],
                        'data_action_type': [],
                        'data_school_type': [],
                        'data_student_type': [],
                        'data_student_level': []
                    });
    
                    return true;
                }
    
                this.getActionsBySchool(values.school_type_id);
                this.sumBySchool(values.school_type_id, "total_schools", "data_school_type");
                this.sumBySchool(values.school_type_id, "total_students", "data_student_type");
                this.getCoverage();
                this.getSchoolTypes();
                this.getStudentTypes();
                // this.sumBySchool(values.school_type_id, "total_action", "data_action_type");
            });
        }

    }

    getOptions = (input, callback) => {            
        const select_array = [
            { "value": "PARTICULAR", "label": "Particular" },
            { "value": "PUBLICO", "label": "Público" },
            { "value": "SECRETARIA", "label": "Secretaria" }
        ];

        this.setState({ search_options: select_array }, function(){
            setTimeout(() => {
                callback(null, {
                options: this.state.search_options,
                complete: true
                });
            }, 500);
        });

    };

    render() {
        const { total_schools, total_students, total_contacts, total_action,
            data_actions, data_school_type, data_student_type, data_action_type, data_student_level,
            data_coverage,
            options_publisher, ring_load, ring_load_change
        } = this.state;

        return (
            <div>
                {(ring_load == true || ring_load_change == true) &&
                    <div className="loader">
                        <div className="backLoading">
                            <div className="load"><img src="https://www.ipswitch.com/library/img/loading.gif" /></div>
                        </div>
                    </div>
                }

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
                
                <div className="search-area">
                    <FormGroup htmlFor="school_type_id">
                        <label>Tipo de Escola</label>
                        <Async
                            removeSelected={false}
                            name="school_type_id"
                            id="school_type_id"
                            disabled={this.state.viewMode}
                            value={this.state.school_type_id}
                            onChange={this.handleChangeSchoolType}
                            loadOptions={this.getOptions}
                            placeholder="Selecione..."
                            multi={true}
                        />
                    </FormGroup>
                </div>

                <div className="row">
                    {data_actions.length > 1 &&
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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