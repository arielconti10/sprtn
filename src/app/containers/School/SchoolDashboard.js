import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

Charts(FusionCharts);

const paletteColors = "#009de8,#FD0006,#1aaf5d,#f45b00,#8e0000,#000000,#7D7D7D,#00CB19,#8C0172,#F70060,#1B7474,#0a3b60,#f2c500,#BCF25B,#00DDCD";

export default class SchoolDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year_param: 0,
            years: [],
            marketshare: this.props.marketshare
        };

        this.handleChangeYear = this.handleChangeYear.bind(this);
    }

    componentWillReceiveProps() {
        let marketshare = this.props.marketshare;         
        let selectedYear = parseInt(new Date().getFullYear());
        let years = [];
        let aux = 0;

        if(marketshare.length > 0){
            selectedYear = marketshare.reduce(function(prevVal, elem) {
                return Math.max(elem.year);
            });

            marketshare.map(item => {
                let year = {};
    
                if(aux !== item.year){
                    year['value'] = item.year;
                    year['label'] = item.year;
                    
                    years.push(year);
                    aux = item.year;
                }
            });
        }

        this.setState({ 
            marketshare: marketshare,
            year_param: selectedYear,
            years: years
        });
    }  

    handleChangeYear = (selectedOption) => {
        if(selectedOption){
            const values = this.state;
            values.year_param = selectedOption.value;
            this.setState({ values });
        }
    }

    render() {
        const { marketshare, years, year_param } = this.state;

        let publishers = [];
        let colections = [];
        
        let pubFTD = null;
        
        marketshare.map(item => {
            if(item.year !== this.state.year_param)
                return;

            let publish = {};
            let colection = {};

            let register = item.key.split(':');
            let key = register[0];
            let label = register[1];

            if (key === 'EDITORAS') {
                publish['label'] = label;
                publish['value'] = item.value;

                if(label.search("FTD") !== -1){
                    pubFTD = publish;
                } else {
                    publishers.push(publish);
                }
            } else {
                colection['label'] = label;
                colection['value'] = item.value;

                colections.push(colection);                
            }
        });

        if(pubFTD){        
            publishers.unshift(pubFTD);
        }

        const dataPublishers = {
            chart: {
                caption: "Editoras",
                paletteColors: paletteColors,
                bgColor: "#ffffff",
                showBorder: "1",
                use3DLighting: "1",
                showShadow: "1",
                enableSmartLabels: "0",
                startingAngle: "0",
                showPercentValues: "1",
                showPercentInTooltip: "0",
                decimals: "1",
                captionFontSize: "14",
                subcaptionFontSize: "14",
                subcaptionFontBold: "0",
                placeValuesInside: "0",
                toolTipColor: "#ffffff",
                toolTipBorderThickness: "0",
                toolTipBgColor: "#000000",
                toolTipBgAlpha: "80",
                toolTipBorderRadius: "2",
                toolTipPadding: "5",
                showHoverEffect: "1",
                showLegend: "1",
                legendBgColor: "#ffffff",
                legendBorderAlpha: "0",
                legendShadow: "0",
                legendItemFontSize: "10",
                legendItemFontColor: "#666666",
                useDataPlotColorForLabels: "1",
                showValues: "1",
            },
            data: publishers
        };

        const dataColections = {
            chart: {
                caption: "Coleções",
                captionFontSize: "14",
                subcaptionFontSize: "14",
                subcaptionFontBold: "0",
                yAxisName: 'Percentual (%)',
                paletteColors: paletteColors,
                valueFontColor: "#000",
                valueFontSize: "13",
                placeValuesInside: "0",
                bgColor: "#ffffff",
                showBorder: "1",
                use3DLighting: "1",
                showShadow: "1",
                enableSmartLabels: "0",
                startingAngle: "0",
                showPercentValues: "1",
                showPercentInTooltip: "0",
                decimals: "1",               
                divlineColor: "#999999",
                divLineDashed: "1",
                divlineThickness: "1",
                divLineDashLen: "1",
                toolTipColor: "#ffffff",
                toolTipBorderThickness: "0",
                toolTipBgColor: "#000000",
                toolTipBgAlpha: "80",
                toolTipBorderRadius: "2",
                toolTipPadding: "5",
                showHoverEffect: "1",
                showLegend: "1",
                legendBgColor: "#ffffff",
                legendBorderAlpha: "0",
                legendShadow: "0",
                legendItemFontSize: "10",
                legendItemFontColor: "#666666",
                useDataPlotColorForLabels: "1"
            },
            data: colections
        };

        const chartConfigsPie = {
            type: 'pie3d',
            width: '100%',
            height: 400,
            dataFormat: 'json',
            dataSource: dataPublishers,
        };

        const chartConfigsColumn = {
            type: 'column3d',
            width: '100%',
            height: 400,
            dataFormat: 'json',
            dataSource: dataColections,
        };

        return (
            <div>
                <Row>
                    <Col md="2">
                        <label>Ano</label>
                        <Select
                            name="year_param"
                            id="year_param"
                            disabled={!(years.length > 1)}
                            clearable={false}
                            value={year_param}
                            onChange={this.handleChangeYear}
                            options={years}
                            placeholder="Não há registros"
                        />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md="12">
                        {/* <Card>
                            <CardBody> */}
                                <ReactFC {...chartConfigsPie} />
                                <br />
                            {/* </CardBody>
                        </Card>
                        <Card>
                            <CardBody> */}
                                <ReactFC {...chartConfigsColumn} />
                            {/* </CardBody>
                        </Card> */}
                    </Col>
                </Row>
            </div>
        )
    }
}