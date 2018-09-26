import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import { formatNumber } from '../../../app/common/FormatHelper';
import { mapPieChart } from '../../../app/common/ChartHelper';

import IndicatorNumber from './IndicatorNumber';
import './Indicators.css';
import PieChartComponent from './PieChartComponent';
import { Async } from 'react-select';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import { connect } from 'react-redux'
import { indicatorsRequest, changeHierarchyRequest } from '../../../actions/indicators';
import { PropTypes } from 'prop-types';

import Select from 'react-select';

class Indicators extends Component {
    static propTypes = { 
        indicatorsRequest: PropTypes.func,
        changeHierarchyRequest: PropTypes.func,
        indicators: PropTypes.shape({
            schoolTypes: PropTypes.array,
            studentTypes: PropTypes.array,
            contacts: PropTypes.number,
            total_action: PropTypes.number,
            coverage: PropTypes.array,
            total_schools: PropTypes.number,
            ring_load: PropTypes.bool,
            actions: PropTypes.array,
            dataActionTypes: PropTypes.array,
        }),
        user: PropTypes.shape({
            username: PropTypes.string,
            access_token: PropTypes.string
        })
    }

    constructor(props) {
        super(props);
        const { indicatorsRequest, user } = this.props;
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
            data_actions: ['Tipos de ações', '%'],
            data_school_type: ['Tipos de ações', '%'],
            data_student_type: ['Tipos de ações', '%'],
            data_action_type: ['Tipos de ações', '%'],
            data_student_level: ['Tipos de ações', '%'],
            data_coverage: ['Tipos de ações', '%'],
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
       
    }
    

    componentDidMount() {  
        this.props.indicatorsRequest(this.props.user)

    }

    componentWillReceiveProps(nextProps){
        this.getSchoolTypes(nextProps);
        this.drawCustomOptions(nextProps.indicators.dataStudentTypes, "options_student_type")
        this.drawCustomOptions(nextProps.indicators.dataActionTypes, "options_action_school");

        this.setState({school_type_id: [
            { "value": "PARTICULAR", "label": "Particular" },
            { "value": "PUBLICO", "label": "Público" },
            { "value": "SECRETARIA", "label": "Secretaria" }
        ]});
        this.setState({"total_contacts": nextProps.indicators.contacts})     
        this.setState({"total_action": nextProps.indicators.total_action}) 

        if(nextProps){


            this.setState({
                "data_actions" : nextProps.indicators.dataActions, 
                "data_action_types": nextProps.indicators.dataActionTypes,
                "data_coverage" : nextProps.indicators.dataCoverage,
                "data_student_level" : nextProps.indicators.dataStudentLevel,
                "data_student_types" : nextProps.indicators.dataStudentTypes,
                "data_school_types" : nextProps.indicators.dataSchoolTypes,
                school_type_id: [
                    { "value": "PARTICULAR", "label": "Particular" },
                    { "value": "PUBLICO", "label": "Público" },
                    { "value": "SECRETARIA", "label": "Secretaria" }
                ], 
                "total_contacts": nextProps.indicators.contacts,
                "total_action": nextProps.indicators.total_action
            })

        }
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
    getCoverage(props) {
        let data_coverage = [];

        props.indicators.coverage.map(item => {
            data_coverage.push(Object.values(item))
        })

        const total = this.groupBySchool(props.indicators.schools, data_coverage, "tmp_coverage", 'total_coverage');
        let array_chart = []

        if (total > 0) {
            const total_schools = props.indicators.total_schools;

            // const general_total = array_final.reduce( (accum, curr) => curr[1] !== '%'?accum + curr[1]:0, 0 );
            const not_coverage = parseFloat(total_schools) - parseFloat(total);

            array_chart = [
                { "name": "Coberto", "total": parseFloat(total) },
                { "name": "Nāo Coberto", "total": not_coverage },
            ];

        } else {
            array_chart = [];
        }
        const action_return = mapPieChart("Ações", "name", "total", array_chart);

        this.setState({ data_coverage: action_return } );

    }

    /**
     * obtem o total de tipos de escolas, separadas por público, privado e secretaria
     */
    getSchoolTypes(props) {
        // const data_school_type = mapPieChart("Tipos de Escola", "school_type", "total", this.props.indicators.schoolTypes);
        // this.groupBySchool(this.props.indicators.schools, this.props.indicators.dataSchoolTypes, "data_school_type", "total_schools", "options_school_type");
        // console.log(props)
        this.drawCustomOptions(props.indicators.dataSchoolTypes, "options_school_type")
        this.getCoverage(props);
    }

    /**
     * obtem o total de alunos, separadas por tipos de escola: público, privado e secretaria
     */
    getStudentTypes() {
        this.drawCustomOptions(props.indicators.dataStudentTypes, "options_student_type")

    }

    drawCustomOptions(chart_result, state_to) {

        const colors = [
            {identity: "PARTICULAR", color: "#278ad8"},
            {identity: "PUBLICO", color: "#dabf42"},
            {identity: "SECRETARIA", color: "#5bdd51"}
        ];

        const colors_chart = [];

        colors.map(item_color => {
            if(typeof chart_result !== 'undefined' && chart_result) {
            chart_result.map(item => {
                if (item_color.identity.indexOf(item[0]) !== -1) {
                    colors_chart.push(item_color.color);
                }
            })
            }
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
        this.drawCustomOptions(this.props.indicators.dataActionTypes, "options_action_school");
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
                if(item_search.value.indexOf(item[0])){
                    final_array.push(item);
                }
            })
        })

        let array_final = [...(new Set(final_array))];
        
        const general_total = array_final.reduce( (accum, curr) => curr[1] !== '%'?accum + curr[1]:0, 0 );

        this.setState( { [ selector_total ]: formatNumber(general_total) } );
        if (final_array.length >= 1) {
            this.setState( { [selector] : final_array }, () => {
                this.drawCustomOptions(final_array, selector_options);
                // this.drawCustomOptions(final_array, selector);
            });
            
        }
        return general_total
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
                    
                    // this.setState( {ring_load_change : false });

                    return true;
                }
    
                this.getActionsBySchool(values.school_type_id);
                this.sumBySchool(values.school_type_id, "total_schools", "data_school_type");
                this.sumBySchool(values.school_type_id, "total_students", "data_student_type");
                this.getCoverage();
                this.getStudentTypes();
                // this.sumBySchool(values.school_type_id, "total_action", "data_action_type");
            });
            this.getSchoolTypes();
        } else {
            this.setState( { ring_load_change: false });
        }
    }

    handleChangeHierarchy = ( selectedOption ) => {
        this.props.changeHierarchyRequest(selectedOption);
        const values = this.state;

        if(selectedOption) {
            values.hierarchy_id = selectedOption;
        }
    }

    mapSelect(dados) {
        const select_array = [];
        const general_object = {value: "", label: "TODOS"};
        
        if(typeof dados !== 'undefined' && Object.keys(dados).length !== 0 ){
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
        const { 
            data_actions, data_school_types, data_student_types, data_action_types, data_student_level, data_coverage,
            options_publisher, options_school_type, options_action_school, options_student_type,
            ring_load_change
        } = this.state;

        return (
            <div>
                {this.props.indicators.ring_load == true &&
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
                                value={this.state.school_type_id}
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
                        total={this.props.indicators.total_schools}
                        label="Escolas"
                    />

                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-success"
                        shadowClass="students shadow"
                        icon="fa fa-users"
                        total={this.props.indicators.total_students}
                        label="Alunos"
                    />

                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-primary"
                        shadowClass="contacts shadow"
                        icon="fa fa-book"
                        total={this.props.indicators.contacts}
                        label="Contatos"
                    />

                    <IndicatorNumber
                        cols="col-6 col-sm-6 col-lg-3"
                        backgroundColor="bg-warning"
                        shadowClass="actions shadow"
                        icon="fa fa-bullseye"
                        total={this.props.indicators.total_action}
                        label="Acões"
                    />

                </div>
                
                <div className="row">
                    {data_actions && data_actions.length > 1 && 
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

                    
                    {data_action_types && data_action_types.length > 1 && 
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="chart-actions-type ">
                            <PieChartComponent
                                data_actions={data_action_types}
                                chart_id="pie_actions_type"
                                options_publisher={options_action_school}
                                label_card="Ações por tipo de escola"
                            />
                        </div>
                    </div>
                    }
                    {data_coverage && data_coverage.length > 1 && 
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

                   {data_school_types && data_school_types.length > 1 && 
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="tab-data">
                            <div className="chart-school-types">
                                <PieChartComponent
                                    data_actions={data_school_types}
                                    chart_id="pie_school_types"
                                    options_publisher={options_school_type}
                                    label_card="Escolas por tipo"
                                />
                            </div>
                        </div>
                    </div>
                    }

                    {data_student_types && data_student_types.length > 1 &&
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="tab-data">
                            <div className="chart-student-types ">
                                <PieChartComponent
                                    data_actions={data_student_types}
                                    chart_id="pie_student_types"
                                    options_publisher={options_student_type}
                                    label_card="Alunos por tipo de escola"
                                />
                            </div>
                        </div>
                    </div>
                    }

                    {data_student_level && data_student_level.length > 1 &&
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


const mapStateToProps = (state) => ({
    indicators: state.indicators,
    user: state.user
})

export default connect(mapStateToProps, {indicatorsRequest, changeHierarchyRequest})(Indicators);