import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import { canUser } from '../../common/Permissions';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadMarketshare, setParamType, setSector, changeTypeFlow, changeSectorFlow } from '../../../actions/marketshare'
import PieChartComponent from '../../common/PieChartComponent';
import ColChartComponent from '../../common/ColChartComponent';

import './MarketShare.css'

const paletteColors = ["#009ce5", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#7D7D7D", "#000000", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];
const pieOptions = {
    pieHole: 0.3,
    slices: [{ color: '#009ce5', }, { color: '#FD0006', }, { color: '#1aaf5d', }, { color: '#f45b00', }, { color: '#8e0000', }, { color: '#7D7D7D', }],
    sliceVisibilityThreshold: 0,
    chartArea: { width: "100%", height: "70%" },
    legend: { alignment: 'center' }
};

class MarketShare extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadMarketshare: PropTypes.func,
        setDataType: PropTypes.func,
        updateSector: PropTypes.func,
        changeTypeFlow: PropTypes.func,
        changeSectorFlow: PropTypes.func,
        marketshare: PropTypes.shape({
            data_year: PropTypes.array,
            data_type: PropTypes.array,
            param_type: PropTypes.object,
            data_subsidiary: PropTypes.array,
            show_publishers: PropTypes.bool,
            show_collections: PropTypes.bool,
            param_secretary: PropTypes.array,
            ring_load: PropTypes.bool,
            show_no_register: PropTypes.bool
        }),
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadMarketshare();
    }

    handleChangeType = (selectedOption) => {
        this.props.setParamType(selectedOption);

        if (selectedOption.value !== "ESCOLA") {
            const marketshare_object = this.props.marketshare;
            const param_subsidiary = marketshare_object.param_subsidiary;
            const param_type = selectedOption.value;
            const param_sector = marketshare_object.param_sector;
            const year = marketshare_object.data_year[0].value;

            this.props.changeTypeFlow(param_subsidiary, param_type, param_sector, year);
        }
    }

    handleChangeSetor = (selectedOption) => {
        this.props.setSector(selectedOption);

        const marketshare_object = this.props.marketshare;
        const param_subsidiary = marketshare_object.param_subsidiary;
        const param_type = marketshare_object.param_type.value;
        const param_sector = selectedOption.value;
        const year = marketshare_object.data_year[0].value;

        this.props.changeSectorFlow(param_subsidiary, param_type, param_sector, year);
    }

    showSecretaries() {
        let secretaries;

        if (show_publishers && param_type.value != 'ESCOLA') {
            const marketshare = this.props.marketshare;
            const data_city_header = marketshare.data_city_header;
            if (data_city_header) {
                secretaries = data_city_header.map((city, i) => {
                    if (marketshare.dataActions) {
                        let dataActions = marketshare.dataActions[i];
    
                        return (
                            <Col xl='6' md='6' sm='12' xs='12' key={i}>
                                <PieChartComponent
                                    data_actions={dataActions}
                                    chart_id={`PieChartSecretary_${i}`}
                                    options_publisher={pieOptions}
                                    label_card={city}
                                />
                            </Col>
                        )
                    }
                })
            }
        }

        return secretaries;
    }

    render() {
        const { data_year, data_type, param_type, data_subsidiary, param_subsidiary, 
            data_sector, param_sector, show_publishers, show_collections, data_publisher,
            data_collection, data_discipline_header, param_discipline, ring_load,
            marketshare_loaded, show_no_register
        } = this.props.marketshare;

        let secretaries;
        let disciplines = [];

        if (show_publishers && param_type.value == 'SECRETARIA') {
            const marketshare = this.props.marketshare;
            const data_city_header = marketshare.data_city_header;

            if (data_city_header) {
                secretaries = data_city_header.map((city, i) => {
                    if (marketshare.dataActions) {
                        let dataActions = marketshare.dataActions[i];

                        return (
                            <Col xl='6' md='6' sm='12' xs='12' key={i}>
                                <PieChartComponent
                                    data_actions={dataActions}
                                    chart_id={`PieChartSecretary_${i}`}
                                    options_publisher={pieOptions}
                                    label_card={city}
                                />
                            </Col>
                        )
                    }
                })
            }
        }
        
        if (show_publishers && param_type.value == 'ESCOLA_DISCIPLINAS') {
            if (data_discipline_header && param_discipline) {
                disciplines = data_discipline_header.map((discipline, i) => {
                    if (param_discipline[i]) {
                        let font = param_discipline[i].length > 13 ? 6 : 11;
                        let colOptions = {};
                        colOptions['chartArea'] = { width: "70%", height: "70%" };
                        colOptions['legend'] = { position: "none" };
                        colOptions['bar'] = { groupWidth: "80%" };
                        colOptions['hAxis'] = { textStyle: { fontSize: font } };

                        let valColor = 0;
                        let maxColors = paletteColors.length - 1;
                        

                        param_discipline[i].map((item, i) => {
                            if (i != 0) {
                                if (valColor > maxColors) valColor = 0;

                                item.push(`color: ${paletteColors[valColor]}`);

                                valColor++;
                            }
                        })

                        if (param_discipline[i].length > 0 && param_type.value == 'ESCOLA_DISCIPLINAS') {
                            let disciplines_chart = param_discipline[i];
                                return (
                                    <Col xl='6' md='6' sm='12' xs='12' key={i}>
                                        <ColChartComponent
                                            data_actions={disciplines_chart?disciplines_chart:[]}
                                            chart_id={`ColChartDiscipline_${i}`}
                                            options={colOptions}
                                            label_card={discipline}
                                        />
                                    </Col>
                                )

                        }
                    


                    }

                })
            }
        }

        return (    
            <div>
                {ring_load == true &&
                    <div className="loader-marketshare">
                        <div className="backLoading">
                            <div className="load"><img src="https://www.ipswitch.com/library/img/loading.gif" /></div>
                        </div>
                    </div>
                }
                {marketshare_loaded &&
                <div>
                <Row>
                    <Col xl='2' md='2' sm='12' xs='12'>
                        <label>Ano</label>
                        <Select
                            name="param_year"
                            id="param_year"
                            disabled={!(data_year.length > 1)}
                            clearable={false}
                            value={'2016'}
                            // onChange={this.handleChangeYear}
                            options={data_year}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col xl='2' md='2' sm='12' xs='12'>
                        <label>Tipo</label>
                        <Select
                            name="param_type"
                            id="param_type"
                            clearable={false}
                            value={param_type}
                            onChange={(selectedOption) => this.handleChangeType(selectedOption)}
                            options={data_type}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col xl='3' md='3' sm='12' xs='12'>
                        <label>Filial</label>
                        <Select
                            name="param_subsidiary"
                            id="param_subsidiary"
                            disabled={data_subsidiary && !(data_subsidiary.length > 1)}
                            clearable={false}
                            value={param_subsidiary}
                            // onChange={(selectedOption) => this.handleChangeSubsidiary(selectedOption)}
                            options={data_subsidiary}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col xl='5' md='5' sm='12' xs='12'>
                        <label>Setor</label>
                        <Select
                            name="param_sector"
                            id="param_sector"
                            disabled={data_sector && !(data_sector.length > 1)}
                            clearable={false}
                            value={param_sector}
                            onChange={this.handleChangeSetor}
                            options={data_sector}
                            placeholder="Selecione"
                        />
                    </Col>

                </Row>

                <br />
                <Row>
                    {
                        show_publishers && param_type.value == 'ESCOLA' &&
                        <Col xl={show_collections ? '6' : '12'} md={show_collections ? '6' : '12'} sm='12' xs='12'>
                            <PieChartComponent
                                data_actions={data_publisher}
                                chart_id="PieChartPlublishers"
                                options_publisher={pieOptions}
                                label_card="Editoras"
                            />
                        </Col>
                    }

                    {show_collections && param_type.value == 'ESCOLA' &&
                        <Col xl='6' md='12' sm='12' xs='12'>
                            <PieChartComponent
                                data_actions={data_collection}
                                chart_id="PieChartCollections"
                                options_publisher={pieOptions}
                                label_card="Coleções"
                            />
                        </Col>
                    }

                    {show_publishers && param_type.value == 'SECRETARIA' &&
                        secretaries
                    }

                    {show_publishers && param_type.value === "ESCOLA_DISCIPLINAS" &&
                        disciplines
                    }

                    {show_no_register &&
                        <div className='no-register'>
                            <span><i className='fa fa-exclamation-circle'></i> Não há registros a serem exibidos!</span><br/>
                            {/* <span>{param_error}</span> */}
                        </div>
                    } 
                </Row>
                </div>
            }
            </div>
        );
    }
}

const mapStateToProps =(state) => ({
    marketshare : state.marketshare
});

export default connect(mapStateToProps, { loadMarketshare, setParamType, setSector, changeTypeFlow, changeSectorFlow } )(MarketShare);