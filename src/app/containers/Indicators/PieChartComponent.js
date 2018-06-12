import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Chart } from 'react-google-charts';

export default class PieChartComponent extends Component {
    render() {
        const { data_actions, options_publisher, label_card, chart_id } = this.props;

        return (
            <Card className="card-chart">
                <CardHeader className="card-header-chart">
                    <span><strong>{label_card}</strong></span>
                </CardHeader>
                <CardBody className="card-body-chart">
                    <Chart
                        chartType="PieChart"
                        data={data_actions}
                        options={options_publisher}
                        graph_id={chart_id}
                        width="100%"
                        height="400px"
                        legend_toggle
                    />
                </CardBody>
             </Card>
        )
    }
}