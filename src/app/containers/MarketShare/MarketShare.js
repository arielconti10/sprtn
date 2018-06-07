import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardHeader } from 'reactstrap';
import Select from 'react-select';
import { Chart } from 'react-google-charts';
import axios from '../../../app/common/axios';
import { canUser } from '../../common/Permissions';

import './MarketShare.css'

const apiUserCurrent = 'user/current';

const pieOptions = {
    pieHole: 0.3,
    slices: [{ color: '#009de8', }, { color: '#FD0006', }, { color: '#1aaf5d', }, { color: '#f45b00', }, { color: '#8e0000', }, { color: '#7D7D7D', }],
    tooltip: { showColorCode: true }
};

class MarketShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ring_load: false,

            user_subsidiary: 0,
            user_sector: 0,

            subsidiary_param: 0,
            sector_param: 0,
            type_param: 0,
            year_param: '2016',

            data_values: [{ value: 'ESCOLA', label: 'ESCOLA' }, { value: 'SECRETARIA', label: 'SECRETARIA' }],
            data_subsidiary: [],
            data_sector: [],
            data_publisher: [['EDITORAS', '%']]
        };

        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.chargeChart = this.marketShareChart.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentWillMount() {
        canUser('indicator.view', this.props.history, "view");
    }

    clearData() {
        this.setState({ data_publisher: [['EDITORAS', '%']] });
    }

    loadSubsidiary() {
        axios.get(`${apiUserCurrent}`).then(response => {
            let user = response.data.data;
            let subsidiary = user.subsidiary;
            let data = [];

            data.push({ value: subsidiary.id, label: `${subsidiary.code} - ${subsidiary.name}`, sectors: user.sector });

            this.setState({ data_subsidiary: data });
        }).catch(err => console.log(4, err));

        this.setState({ ring_load: false });
    }

    loadSector(sectors) {
        this.setState({ data_sector: [{ value: sectors.id, label: sectors.name }] });
    }

    marketShareChart() {
        this.setState({ ring_load: true });

        let urlPost = `marketshare?filter[key]=${this.state.type_param}_EDITORAS_CONSOLIDADO&filter[year]=${this.state.year_param}`;

        axios.get(`${urlPost}`).then(response => {
            let marketShare = response.data.data;
            let publishers = this.state.data_publisher;
            let pubFTD = null;
            let aux = 0;
            let order = [];
            let vlOthers = 0;

            marketShare.sort((a, b) => a.value - b.value);

            marketShare.map((item, i) => {
                let register = item.key.split(':');
                let key = register[0];
                let sector = register[1];
                let label = register[2];

                if (this.state.subsidiary_param == item.subsidiary_id && sector == this.state.sector_param) {
                    if (aux !== item.value) {
                        order.push(item);
                        aux = item.value;
                    }
                }
            });

            let data_order = order.reverse();

            data_order.map((item, i) => {
                let register = item.key.split(':');
                let key = register[0];
                let sector = register[1];
                let label = register[2];

                if (i <= 4) {
                    if (this.state.subsidiary_param == item.subsidiary_id && sector == this.state.sector_param) {
                        if (label.search("FTD") !== -1) {
                            pubFTD = [label, item.value];
                        } else {
                            publishers.push([label, item.value,]);
                        }
                    }
                } else {
                    vlOthers += item.value;
                }
            });

            if (vlOthers !== "") publishers.push(["OUTROS", vlOthers]);

            if (pubFTD) publishers.splice(1, 0, pubFTD);

            this.setState({ data_publisher: publishers, ring_load: false });

        }).catch(err => console.log(4, err));
    }

    handleChangeSubsidiary = (selectedOption) => {
        const values = this.state;
        values.subsidiary_param = selectedOption.value;
        this.setState({ values });
        this.loadSector(selectedOption.sectors);
        this.clearData();
        this.setState({ sector_param: '' });
    }

    handleChangeSetor = (selectedOption) => {
        const values = this.state;
        values.sector_param = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.marketShareChart(sector_param);
    }

    handleChangeType = (selectedOption) => {
        const values = this.state;
        values.type_param = selectedOption.value;
        this.setState({ values });
        this.setState({ subsidiary_param: '', sector_param: '' });
        this.clearData();
        this.loadSubsidiary();
    }

    render() {
        const { data_publisher, ring_load, data_values, data_subsidiary, subsidiary_param, data_sector, sector_param, type_param } = this.state;

        return (
            <div>
                {ring_load == true &&
                    <div className="loader-marketshare"> 
                        <div className="backLoading"> 
                            <div className="load"><img src="https://www.ipswitch.com/library/img/loading.gif" /></div> 
                        </div> 
                    </div> 
                } 
                <Row>
                    <Col md="2">
                        <label>Tipo</label>

                        <Select
                            name="type_param"
                            id="type_param"
                            clearable={false}
                            value={type_param}
                            onChange={(selectedOption) => this.handleChangeType(selectedOption)}
                            options={data_values}
                            placeholder="Não há registros"
                        />
                    </Col>

                    <Col md="3">
                        <label>Filial</label>

                        <Select
                            name="subsidiary_param"
                            id="subsidiary_param"
                            disabled={!(data_subsidiary.length > 0)}
                            clearable={false}
                            value={subsidiary_param}
                            onChange={(selectedOption) => this.handleChangeSubsidiary(selectedOption)}
                            options={data_subsidiary}
                            placeholder="Não há registros"
                        />
                    </Col>

                    <Col md="2">
                        <label>Setor</label>
                        <Select
                            name="sector_param"
                            id="sector_param"
                            disabled={!(data_sector.length > 0)}
                            clearable={false}
                            value={sector_param}
                            onChange={this.handleChangeSetor}
                            options={data_sector}
                            placeholder="Não há registros"
                        />
                    </Col>
                </Row>
                <br />

                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <span><strong>EDITORAS </strong></span>
                            </CardHeader>
                            <CardBody>
                                <Chart
                                    chartType="PieChart"
                                    data={data_publisher}
                                    options={pieOptions}
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

export default MarketShare;