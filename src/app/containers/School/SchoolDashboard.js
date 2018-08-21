import React, { Component } from 'react';
import axios from '../../../app/common/axios';
import ReactDOM from 'react-dom';
import { Col, Row, Card, CardBody, CardHeader } from 'reactstrap';
import Select from 'react-select';
import { RingLoader } from 'react-spinners';
import { Chart } from 'react-google-charts';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDashFlow, changeYearFlow } from '../../../actions/schoolDash'

import 'react-select/dist/react-select.css';

const paletteColors = ["#009de8", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#000000", "#7D7D7D", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];

const options_publisher = {
    pieHole: 0.2,
    is3D: false
};

const options_colection = {
    legend: {
        position: "none"
    },
    bar: {
        groupWidth: "85%"
    }
};

class SchoolDashboard extends Component {
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadDashFlow: PropTypes.func,
        changeYearFlow: PropTypes.func,
        school: PropTypes.shape({
            // data_year: PropTypes.array,
        }),
    }

    constructor(props) {
        super(props);
        this.handleChangeYear = this.handleChangeYear.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
        const user = this.props.user;
        const school = this.props.school;
        const marketshare = school.marketshare;

        if (marketshare !== nextProps.school.marketshare) {
            const nextMarketshare = nextProps.school.marketshare;
            this.props.loadDashFlow(user, nextMarketshare);
        }
    }

    // componentWillMount() {
    //     console.log("WILL MOUNT!");
    //     const user = this.props.user;
    //     const school = this.props.school;
    //     const marketshare = school.marketshare;

    //     console.log(marketshare);

    //     this.props.loadDashFlow(user, marketshare);
    // }

    handleChangeYear = (selectedOption) => {
        const school = this.props.school;
        const marketshare = school.marketshare;

        this.props.changeYearFlow(selectedOption, marketshare);
    }

    render() {
        const { years, year_param, publishers, ringLoad, colections } = this.props.schoolDash;

        return (
            <div>

                <Row>
                    <Col md="2">
                        <label>Ano</label>
                        <Select
                            name="year_param"
                            id="year_param"
                            disabled={years && !(years.length > 1)}
                            clearable={false}
                            value={years && years.length > 1?year_param:''}
                            onChange={this.handleChangeYear}
                            options={years}
                            placeholder="Não há registros"
                        />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <span><strong>EDITORAS</strong></span>
                            </CardHeader>
                            <CardBody>
                                <Chart
                                    chartType="PieChart"
                                    data={publishers}
                                    options={options_publisher}
                                    graph_id="PieChart"
                                    width="100%"
                                    height="400px"
                                    legend_toggle
                                />
                            </CardBody>
                        </Card>
                        <br />
                        <Card>
                            <CardHeader>
                                <span><strong>COLEÇÕES</strong></span>
                            </CardHeader>
                            <CardBody>
                                <Chart
                                    chartType="BarChart"
                                    data={colections}
                                    options={options_colection}
                                    graph_id="BarChart"
                                    width="100%"
                                    height="400px"
                                    legend_toggle
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps =(state) => ({
    schoolDash : state.schoolDash,
    user: state.user
});

const functions_object = {
    loadDashFlow,
    changeYearFlow
}

export default connect(mapStateToProps, functions_object )(SchoolDashboard);