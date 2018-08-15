import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import { formatNumber } from '../../../app/common/FormatHelper';
import { mapPieChart } from '../../../app/common/ChartHelper';

import IndicatorNumber from './IndicatorNumber';
import './Indicators.css';
import PieChartComponent from './PieChartComponent';
import { Async } from 'react-select';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import Select from 'react-select'

// include our indicatorsRequest action
import { indicatorsRequest } from '../../../actions/indicators';

import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'

class Indicators extends Component {
    static propTypes = {
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            access_token: PropTypes.string.isRequired,
        }),
        indicators: PropTypes.shape({
            contributors: PropTypes.object,
            schools: PropTypes.array,
        }),
        indicatorsRequest: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.fetchIndicators()
        this.state = {
            active_tab: 'chart_actions',
            total_schools: '00',
            total_students: '00',
            total_contacts: '00',
            total_action: '00',
            total_coverage: 0,
            school_types: [],
            search_options: [],
            search_options_hierarchy: [],
            school_type_id: '',
            hierarchy_id: '',
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
            options_school_type: {},
            options_action_school: {},
            options_student_type: {},
            ring_load: false,
            ring_load_change: false,
            msg_error: ''

        };

        this.handleChangeSchoolType = this.handleChangeSchoolType.bind(this);
        this.handleChangeHierarchy = this.handleChangeHierarchy.bind(this);
        this.getActionsRealized = this.getActionsRealized.bind(this);
    }

    // the helper function for requesting widgets
    // with our client as the parameter
    fetchIndicators = () => {
        const { user, indicatorsRequest } = this.props

        if (user && user.access_token) return indicatorsRequest(user)
        return false
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

        let url_contact = "indicator/school/contact";
        url_contact = this.getUrlSearch(url_contact);

        this.requestTotal(url_contact, "total_contacts", function () {
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
        let baseURL = "indicator/school/coverage";
        baseURL = this.getUrlSearch(baseURL);

        axios.get(baseURL)
            .then(res => {
                const result = res.data.data;
                const data_coverage = mapPieChart("Tipos de Escola", "school_type", "total", result);

                this.groupBySchool(this.props.indicators.schools, data_coverage, "tmp_coverage", 'total_coverage');

                const total_coverage = this.state.total_coverage;

                if (total_coverage.length > 0) {
                    const total_schools = this.state.total_schools.replace(/\./g,'');

                    const not_coverage = parseFloat(total_schools) - parseFloat(total_coverage);

                    const array_chart = [
                        { "name": "Coberto", "total": parseFloat(total_coverage) },
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
                this.setState({ data_coverage } );

                
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
        let baseURL = "indicator/school/action";
        baseURL = this.getUrlSearch(baseURL);

        axios.get(baseURL)
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
        let baseURL = "indicator/school/type";
        baseURL = this.getUrlSearch(baseURL);

        axios.get(baseURL)
            .then(res => {
                const result = res.data.data;
                const data_school_type = mapPieChart("Tipos de Escola", "school_type", "total", result);

                return data_school_type;
            })
            .then(data_school_type => {

                this.groupBySchool(this.props.indicators.schools, data_school_type, "data_school_type", "total_schools", "options_school_type");

                this.getCoverage();
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
        let baseURL = "indicator/student/school-type";
        baseURL = this.getUrlSearch(baseURL);

        axios.get(baseURL)
            .then(res => {
                const result = res.data.data.total;
                const data_student_type = mapPieChart("Tipos de Escola", "school_type", "total", result);

                this.groupBySchool(this.props.indicators.schools, data_student_type, "data_student_type", "total_students", "options_student_type");

                this.setState ( { ring_load : false });
            })
            .catch(error => {
                const response = error.response;
                this.setState({ msg_error: `Ocorreu o seguinte erro: ${response.status} - ${response.statusText}` });
            })
    }

    drawCustomOptions(chart_result, state_to) {
        const colors = [
            {identity: "PARTICULAR", color: "#278ad8"},
            {identity: "PUBLICO", color: "#dabf42"},
            {identity: "SECRETARIA", color: "#5bdd51"}
        ];

        const colors_chart = [];

        colors.map(item_color => {
            chart_result.map(item => {
                if (item_color.identity.indexOf(item[0]) !== -1) {
                    colors_chart.push(item_color.color);
                }
            })
        });

        const new_options = { pieHole: 0.2, is3D: false, 
            sliceVisibilityThreshold: 0,
            chartArea: {  width: "100%", height: "70%" },
            legend: { 
                // position : 'bottom',
                alignment: 'center',
            },
            pieSliceTextStyle: {
                color: "#ffffff",
                fontSize: "20pt"
            },
            colors: colors_chart
        };

        this.setState( { [state_to] : new_options });
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

                this.drawCustomOptions(data_action_type, "options_action_school");
                
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
        let baseURL = "indicator/student/level";
        baseURL = this.getUrlSearch(baseURL);

        axios.get(baseURL)
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
        if (actions) {
            const total = actions.reduce( (accum, current) => accum + current.total, 0);
            return total;
        }

        return 0;

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
            if (types && types.hasOwnProperty(item.value)) {
                const actions = types[item.value];
                const total_actions = this.getTotalActions(actions);  
                const total_object = { "school_type" : item.value, "total" : total_actions};  
                total_array.push(total_object);
                if (actions) {
                    tmp_array.push(actions);
                }
            }

            
        });

        tmp_array.map(item => item.map(action => {
                action_array.push(action);
            })
        )

        const total_general = total_array.reduce( (accum, current) => accum + current.total, 0);

        const data_action_type = mapPieChart("Tipos de Escola", "school_type", "total", total_array);
        const chart_actions = mapPieChart("Ações Realizadas", "action", "total", action_array);

        this.drawCustomOptions(data_action_type, "options_action_school");

        this.setState({ data_action_type, data_actions: chart_actions,  total_action: total_general }, function() {
        });
    }


    /**
     * verifica as pesquisas que serāo realizadas, montando a URL base
     * @param { String } baseURL url atual
     * @return { String } concatURL url da pesquisa
     */
    getUrlSearch(baseURL) {
        let concatURL = baseURL;
        if (this.state.hierarchy_id.value && this.state.hierarchy_id.value !== "") {
            const hierarchy_id = this.state.hierarchy_id.value;
            concatURL = concatURL + `?filter[user_id][]=${hierarchy_id}`;
        }

        return concatURL;
    }

    /**
     * obtem o total de ações de acordo com o tipo de escola
     * @param {String} school_type_id tipo de escola, por exemplo: "público", "particular" ou "secretaria"
     */
    getActionsBySchool(school_type_id) {
        this.setState({ ring_load : true });
        let baseURL = "indicator/action/type/school-type";
        baseURL = this.getUrlSearch(baseURL);

        axios.get(baseURL)
        .then(res => {
            const data_general = res.data.data;
            const types = data_general.school_type;

            this.listTotalActions(school_type_id, types);

            this.setState({ ring_load_change : false } );

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
    groupBySchool(selected, types, selector, selector_total = "", selector_options = "") {
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


        if (final_array.length >= 1) {
            this.setState( { [selector] : final_array }, () => {
                this.drawCustomOptions(final_array, selector_options);
                // this.drawCustomOptions(final_array, selector);
            });
            
        }

        
    }

    handleChangeSchoolType (selectedOption) {
        this.setState( {ring_load_change : true });
        const values = this.state;
        if(selectedOption.length > 0) {
            values.school_type_id = selectedOption;
            this.setState({ values }, () => {
                if (this.props.indicators.schools.length === 0) {
                    this.setState( {
                        'data_actions': [],
                        'data_action_type': [],
                        'data_coverage': [],
                        'data_action_type': [],
                        'data_school_type': [],
                        'data_student_type': [],
                        'data_student_level': []
                    });
                    
                    // this.setState( {ring_load_change : false });

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
        } else {
            this.setState( { ring_load_change: false });
        }
    }

    handleChangeHierarchy = (selectedOption) => { 
        this.setState( {ring_load_change : true });
        const values = this.state;
        if(selectedOption) {
            values.hierarchy_id = selectedOption;
            this.setState({ values }, () => {
                if (this.props.indicators.schools.length === 0) {
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
                this.getStudentLevel();

                let url_contact = "indicator/school/contact";
                url_contact = this.getUrlSearch(url_contact);
        
                this.requestTotal(url_contact, "total_contacts", function () {});
                // this.sumBySchool(values.school_type_id, "total_action", "data_action_type");
            });
        } else {
            this.setState( { ring_load_change: false });
        }
    }

    mapSelect(dados) {
        const select_array = [];
        const general_object = {value: "", label: "TODOS"};

        if (dados.length) {
            dados.map(item => {
                const label = `${item.username} - ${item.full_name}`;
                const item_object = {"value": item.id, "label": label};
                select_array.push(item_object);
            });
    
            select_array.sort(function (a, b) {
                if(a.label < b.label) return -1;
                if(a.label > b.label) return 1;
                return 0;
            });
    
            select_array.unshift(general_object);
        }


        return select_array;
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

    getOptionsHierarchy = (input, callback) => {
        
            const data = this.props.indicators.contributors;
            const select_array = this.mapSelect(data);

            this.setState({ search_options_hierarchy: select_array }, function(){
                setTimeout(() => {
                    callback(null, {
                    options: this.state.search_options_hierarchy,
                    complete: true
                    });
                }, 500);
            });

    };

    render() {
        const { total_schools, total_students, total_contacts, total_action,
            data_actions, data_school_type, data_student_type, data_action_type, data_student_level,
            data_coverage,
            options_publisher, options_school_type, options_action_school, options_student_type,
            ring_load, ring_load_change
        } = this.state;

        const { contributors, schools } = this.props.indicators;

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

                <div className="search-area">
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup htmlFor="school_type_id">
                                <label>Colaborador</label>
                                <Async
                                    removeSelected={false}
                                    name="hierarchy_id"
                                    id="hierarchy_id"
                                    disabled={this.state.viewMode}
                                    value={this.state.hierarchy_id}
                                    onChange={this.handleChangeHierarchy}
                                    loadOptions={this.getOptionsHierarchy}
                                    placeholder="Selecione..."
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup htmlFor="school_type_id">
                            <label>Tipo de Escola</label>
                            <Async
                                removeSelected={false}
                                name="school_type_id"
                                id="school_type_id"
                                disabled={this.state.viewMode}
                                value={this.props.indicators.schools}
                                onChange={this.handleChangeSchoolType}
                                loadOptions={this.getOptions}
                                placeholder="Selecione..."
                                multi={true}
                            />
                            </FormGroup>
                        </div>
                    </div>

                </div>

                <div className="row indicators-numbers justify-content-md-center">
                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-info"
                        shadowClass="school shadow"
                        icon="fa fa-building-o"
                        total={total_schools}
                        label="Escolas"
                    />

                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-success"
                        shadowClass="students shadow"
                        icon="fa fa-users"
                        total={total_students}
                        label="Alunos"
                    />

                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-primary"
                        shadowClass="contacts shadow"
                        icon="fa fa-book"
                        total={total_contacts}
                        label="Contatos"
                    />

                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-warning"
                        shadowClass="actions shadow"
                        icon="fa fa-bullseye"
                        total={total_action}
                        label="Acões"
                    />

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
                                options_publisher={options_action_school}
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
                                    options_publisher={options_school_type}
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
                                    options_publisher={options_student_type}
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

const mapStateToProps = state => ({
    user: state.user,
    indicators: state.indicators,
})

const connected = connect(mapStateToProps, { indicatorsRequest })(Indicators);

export { connected as Indicators }