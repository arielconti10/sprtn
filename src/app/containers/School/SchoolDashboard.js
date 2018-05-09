import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import { Card, CardBody } from 'reactstrap';

Charts(FusionCharts);

export default class SchoolDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {            
            marketshare: this.props.marketshare,
            publishers: [],
            colections: []
        };
    }

    componentWillReceiveProps() {
        this.setState({ marketshare: this.props.marketshare });
    }

    componentDidMount() {
        let dashData = this.state.marketshare;

        let publishers = [];
        let colections = [];

        dashData.map(item => {
            let publish = {};
            let colection = {};

            let register = item.key.split(':');
            let key = register[0];
            let label = register[1];

            if(key === 'EDITORAS') {
                publish['label'] = label;
                publish['value'] = item.value;

                publishers.push(publish);
            } else {
                colection['label'] = label;
                colection['value'] = item.value;
                
                colections.push(colection);
            }
        });

        console.log('publishers:', publishers);
        console.log('colections:', colections);

        this.setState({ publishers, colections });

        console.log('this.state:', this.state);

    }

    render(){
        const { publishers, colections } = this.state;

        const dataPublishers = {
            chart: {
                caption: "Editoras",
                subCaption: "2016",
                paletteColors: "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                bgColor: "#ffffff",
                showBorder: "0",
                use3DLighting: "0",
                showShadow: "0",
                enableSmartLabels: "0",
                startingAngle: "0",
                showPercentValues: "1",
                showPercentInTooltip: "0",
                decimals: "1",
                captionFontSize: "14",
                subcaptionFontSize: "14",
                subcaptionFontBold: "0",
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
            data: publishers
          };

          const dataColections = {
            chart: {
                caption: "Coleções",
                subCaption: "2016",
                paletteColors: "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                valueFontColor: "#ffffff",
                bgColor: "#ffffff",
                showBorder: "0",
                use3DLighting: "0",
                showShadow: "0",
                enableSmartLabels: "0",
                startingAngle: "0",
                showPercentValues: "1",
                showPercentInTooltip: "0",
                decimals: "1",
                captionFontSize: "14",
                subcaptionFontSize: "14",
                subcaptionFontBold: "0",
                placeValuesInside: "1",
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
            width: 1000,
            height: 400,
            dataFormat: 'json',
            dataSource: dataPublishers,
          };

          const chartConfigsColumn = {
            type: 'column3d',
            width: 1000,
            height: 400,
            dataFormat: 'json',
            dataSource: dataColections,
          };

        return(
            <div>
                <Card>
                    <CardBody>
                        <ReactFC {...chartConfigsPie} />
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <ReactFC {...chartConfigsColumn} />
                    </CardBody>
                </Card>
            </div>
        )
    }
}