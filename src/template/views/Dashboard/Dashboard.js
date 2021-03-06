import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardHeader } from 'reactstrap';
import Select from 'react-select';
import { RingLoader } from 'react-spinners';
import { Chart } from 'react-google-charts';
import axios from '../../../app/common/axios';

const apiPost = 'school';

const paletteColors = ["#009de8", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#000000", "#7D7D7D", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            year_param: 0,
            years: [],
            marketshare: [],
            schoolId: '40662',
            options_publisher: {
                pieHole: 0.2,
                is3D: false
            },
            data_publisher: [],
            options_colection: {
                legend: {
                    position: "none"
                },
                bar: {
                    groupWidth: "85%"
                }
            },
            data_colection: [],
        };

        //   this.handleChangeYear = this.handleChangeYear.bind(this);
        //    this.chargeChart = this.chargeChart.bind(this);
    }

    componentWillMount() {
        this.chargeChart();
    }

    chargeChart() {

        let initDataP = [['Editoras', '%']];
        let initDataC = [['Coleções', '%', { 'role': 'style' }], ['', 0, '']];

        this.setState({ ringLoad: true, data_publisher: initDataP, data_colection: initDataC });

        if (this.state.schoolId !== undefined) {

            axios.get(`${apiPost}/${40662}`).then(response => {

                let marketshare = response.data.data.marketshare;

                let selectedYear = parseInt(new Date().getFullYear());
                let years = [];
                let aux = 0;

                if (marketshare.length > 0) {
                    selectedYear = marketshare.reduce(function (prevVal, elem) {
                        return Math.max(elem.year);
                    });

                    marketshare.map(item => {
                        let year = {};

                        if (aux !== item.year) {
                            year['value'] = item.year;
                            year['label'] = item.year;
                            years.push(year);
                            aux = item.year;
                        }
                    });

                    years.push({ value: 2017, label: 2017 },{ value: 2018, label: 2018 },{ value: 201, label: 2019 })
                }

                if (this.state.year_param === 0) {
                    this.setState({ year_param: selectedYear });
                }
                let publishers = this.state.data_publisher;
                let colections = this.state.data_colection;

                let pubFTD = null;

                marketshare.map((item, i) => {
                    if (item.year !== this.state.year_param) return;

                    let register = item.key.split(':');
                    let key = register[0];
                    let label = register[1];

                    if (key === 'EDITORAS') {
                        if (label.search("FTD") !== -1) {
                            pubFTD = [label, item.value];
                        } else {
                            publishers.push([label, item.value]);
                        }
                    } else {
                        colections.push([label, item.value, `color: ${paletteColors[i]}`]);
                    }

                });

                if (pubFTD) {
                    publishers.splice(1, 0, pubFTD);
                }

                if (this.state.years.length < 1) {
                    this.setState()
                }

                this.setState({
                    marketshare: marketshare,
                    years: years,
                    data_publisher: publishers,
                    data_colection: colections,

                    ringLoad: false
                });

            }).catch(err => console.log(4, err));

        } else {
            this.setState({ ringLoad: false });
        }
    }

    render() {
        const { data_publisher, options_publisher, data_colection, options_colection, ringLoad, years, year_param, selectedOption } = this.state;

        return (
            <div className="animated fadeIn">
                <RingLoader
                    color={'#123abc'}
                    loading={ringLoad}
                    margin='50px'
                />

              
                <br />
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <span><strong>TESTE </strong></span>
                            </CardHeader>
                            <CardBody>
                                <Chart
                                    chartType="BarChart"
                                    data={data_publisher}
                                    options={options_publisher}
                                    graph_id="PieChart"
                                    width="100%"
                                    height="400px"
                                    legend_toggle
                                />
                            </CardBody>
                        </Card>
                        <br />
                       
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
