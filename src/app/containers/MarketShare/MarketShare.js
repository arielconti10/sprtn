import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select';
import { Chart } from 'react-google-charts';
import axios from '../../../app/common/axios';
import { canUser } from '../../common/Permissions';

import './MarketShare.css'

const apiUserCurrent = 'user/current';
const apiHierarchy = 'hierarchy/childrens';
const paletteColors = ["#009de8", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#000000", "#7D7D7D", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];

const pieOptions = {
    pieHole: 0.3,
    slices: [{ color: '#009de8', }, { color: '#FD0006', }, { color: '#1aaf5d', }, { color: '#f45b00', }, { color: '#8e0000', }, { color: '#7D7D7D', }],
    tooltip: { showColorCode: true }
};

const options_collection = {
    legend: { position: "none" },
    bar: { groupWidth: "85%" }
}

class MarketShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_role: '',

            active_tab: 'publishers',

            show_publishers: false,
            show_collections: false,
            ring_load: false,

            user_subsidiary: 0,
            user_sector: 0,

            param_subsidiary: '',
            param_sector: '',
            param_city: '',
            param_type: '',
            param_year: '',

            data_year: [{ value: '2016', label: '2016' }],
            data_type: [],
            data_subsidiary: [],
            data_sector: [],
            data_city: [],
            data_publisher: [['EDITORAS', '%']],
            data_collection: [['COLEÇÕES', '%']]
        };

        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.publisherChart = this.publisherChart.bind(this);
        this.collectionChart = this.collectionChart.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentWillMount() {
        canUser('indicator.view', this.props.history, "view");
    }

    toggle(tab) {
        if (this.state.active_tab !== tab) {
            this.setState({
                active_tab: tab
            });
        }
    }

    clearData() {
        this.setState({
            show_publishers: false,
            data_publisher: [['EDITORAS', '%']],
            show_collections: false,
            data_collection: [['COLEÇÕES', '%']]
            // data_collection: [['Coleções', '%', { 'role': 'style' }], ['', 0, '']]
        });
    }

    loadType() {
        this.setState({ data_type: [{ value: 'ESCOLA', label: 'ESCOLA' }, { value: 'SECRETARIA', label: 'SECRETARIA' }] });
    }

    loadSubsidiary() {
        axios.get(`${apiUserCurrent}`).then(response => {
            let user = response.data.data;
            let roleCode = user.role.code;
            let subsidiary = [];
            let data = [];

            this.setState({ user_role: roleCode });

            if (roleCode == 'coord') {
                axios.get(`${apiHierarchy}`).then(response => {
                    let subordinates = response.data.data;
                    let subsidiaries = [];
                    let sectors = [];
                    let arrSectors = [];

                    subordinates.map(user => {
                        if (user.subsidiary_id !== null)
                            subsidiaries.push(user.subsidiary);

                        if (user.sector_id !== null)
                            sectors.push(user.sector);
                    })

                    sectors.sort(function (a, b) { return a.code - b.code }).map(sec => {
                        let param = {};
                        param['value'] = sec.code;
                        param['label'] = sec.name;

                        arrSectors.push(param);
                    });

                    arrSectors = arrSectors.filter((item, index, self) =>
                        index === self.findIndex((obj) => (
                            obj.value === item.value
                        ))
                    );

                    subsidiaries.sort(function (a, b) { return a.code - b.code }).map(sub => {
                        let param = {};
                        param['value'] = sub.id;
                        param['label'] = `${sub.code} - ${sub.name}`;
                        param['sectors'] = arrSectors;

                        data.push(param);
                    });

                    data = data.filter((item, index, self) =>
                        index === self.findIndex((obj) => (
                            obj.value === item.value
                        ))
                    );

                    this.setState({ data_subsidiary: data });
                    if (data.length == 1) this.setState({ param_subsidiary: data[0].value }, () => this.loadSector(data[0].sectors));

                }).catch(err => console.log(4, err));
            } else {
                subsidiary = user.subsidiary;

                data.push({ value: subsidiary.id, label: `${subsidiary.code} - ${subsidiary.name}`, sectors: user.sector });
            }

            this.setState({ data_subsidiary: data });

            if (data.length == 1) this.setState({ param_subsidiary: data[0].value }, () => this.loadSector(data[0].sectors));
        }).catch(err => console.log(4, err));

        this.setState({ ring_load: false });
    }

    loadSector(sectors) {
        let data = [];
        let sec = '';

        if (sectors.length) {
            data = sectors;
        } else {
            data = [{ value: sectors.code, label: sectors.name }];
            sec = sectors.code;
        }

        this.setState({ data_sector: data, param_sector: sec }, () => this.publisherChart());
    }

    publisherChart() {
        if (this.state.param_sector != '') {
            this.setState({ ring_load: true });

            let urlPost = `marketshare?filter[subsidiary.id]=${this.state.param_subsidiary}&filter[key]=${this.state.param_type}_EDITORAS_CONSOLIDADO:${this.state.param_sector}:&filter[year]=${this.state.param_year}`;

            axios.get(`${urlPost}`).then(response => {
                let marketShare = response.data.data;
                let publishers = this.state.data_publisher;
                let cities = this.state.data_city;
                let pubFTD = null;
                let others = 0;
                let isSchool = this.state.param_type == 'ESCOLA' ? true : false;

                marketShare.sort((a, b) => a.value - b.value).reverse();

                if (!isSchool && cities.length < 1) {
                    marketShare.map((item, i) => {
                        let register = item.key.split(':');
                        let city = register[2];

                        let valueCity = {};
                        valueCity['value'] = city;
                        valueCity['label'] = city;

                        cities.push(valueCity);
                    });

                    cities = cities.filter((item, index, self) =>
                        index === self.findIndex((obj) => (
                            obj.value === item.value
                        ))
                    );

                    cities.sort((a, b) => a.value.localeCompare(b.value));

                    this.setState({ data_city: cities });
                }

                if (!isSchool && this.state.param_city == '') {
                    let param = cities.length > 0 ? cities[0].value : '';
                    this.setState({ param_city:  param })
                };

                let cont = 0;

                marketShare.map((item, i) => {
                    let register = item.key.split(':');
                    let label = isSchool ? register[2] : register[3];
                    let city = isSchool ? '' : register[2]

                    if (cont < 5) {
                        if (!isSchool && city != this.state.param_city) return;

                        if (label.search("FTD") !== -1) {
                            pubFTD = [label, item.value];
                        } else {
                            publishers.push([label, item.value]);
                        }

                        cont ++;
                    } else {
                        others += item.value;
                    }
                });

                if (others !== "") publishers.push(["OUTROS", others]);

                if (pubFTD) publishers.splice(1, 0, pubFTD);

                let show_pub = publishers.length > 2 ? true : false;

                this.setState({ data_publisher: publishers, show_publishers: show_pub }, () => this.collectionChart());
            }).catch(err => console.log(4, err));
        }
    }

    collectionChart() {
        let urlPost = `marketshare?filter[subsidiary.id]=${this.state.param_subsidiary}&filter[key]=${this.state.param_type}_COLECOES_CONSOLIDADO:${this.state.param_sector}&filter[year]=${this.state.param_year}`;

        axios.get(`${urlPost}`).then(response => {
            let marketShare = response.data.data;
            let collections = this.state.data_collection;
            let pubFTD = null;
            let others = 0;

            marketShare.sort((a, b) => a.value - b.value).reverse();

            marketShare.map((item, i) => {
                let register = item.key.split(':');
                let label = register[2];

                if (i < 5) {
                    if (label.search("FTD") !== -1) {
                        pubFTD = [label, item.value];
                    } else {
                        collections.push([label, item.value]);
                    }
                } else {
                    others += item.value;
                }
            });

            if (others !== "") collections.push(["OUTROS", others]);

            if (pubFTD) collections.splice(1, 0, pubFTD);

            let show_col = collections.length > 3 ? true : false;

            this.setState({ data_collection: collections, show_collections: show_col, ring_load: false });

        }).catch(err => console.log(4, err));
    }

    handleChangeYear = (selectedOption) => {
        const values = this.state;
        values.param_year = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.setState({
            param_type: '',
            param_subsidiary: '',
            param_sector: '',
            param_city: '',
            data_type: [{ value: 'ESCOLA', label: 'ESCOLA' }, { value: 'SECRETARIA', label: 'SECRETARIA' }],
            data_subsidiary: [],
            data_sector: [],
            data_city: []
        });

    }

    handleChangeType = (selectedOption) => {
        const values = this.state;
        values.param_type = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.setState({
            param_subsidiary: '',
            param_sector: '',
            param_city: '',
            data_subsidiary: [],
            data_sector: [],
            data_city: []
        });
        this.loadSubsidiary();
    }

    handleChangeSubsidiary = (selectedOption) => {
        const values = this.state;
        values.param_subsidiary = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.setState({
            param_sector: '',
            param_city: '',
            data_sector: [],
            data_city: []
        });
        this.loadSector(selectedOption.sectors);
    }

    handleChangeSetor = (selectedOption) => {
        const values = this.state;
        values.param_sector = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.setState({
            param_city: '',
            data_city: []
        });
        this.publisherChart();
    }

    handleChangeCity = (selectedOption) => {
        const values = this.state;
        values.param_city = selectedOption.value;
        this.clearData();
        this.setState({ values });
        this.publisherChart();
    }

    render() {
        const {
            data_publisher, data_collection, ring_load, show_publishers,
            show_collections, data_year, data_type, data_subsidiary, param_year,
            param_subsidiary, data_sector, data_city, param_sector, param_type,
            param_city, active_tab
        } = this.state;

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
                        <label>Ano</label>
                        <Select
                            name="param_year"
                            id="param_year"
                            clearable={false}
                            value={param_year}
                            onChange={this.handleChangeYear}
                            options={data_year}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col md="2">
                        <label>Tipo</label>

                        <Select
                            name="param_type"
                            id="param_type"
                            disabled={!(data_type.length > 0)}
                            clearable={false}
                            value={param_type}
                            onChange={(selectedOption) => this.handleChangeType(selectedOption)}
                            options={data_type}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col md="3">
                        <label>Filial</label>

                        <Select
                            name="param_subsidiary"
                            id="param_subsidiary"
                            disabled={!(data_subsidiary.length > 0)}
                            clearable={false}
                            value={param_subsidiary}
                            onChange={(selectedOption) => this.handleChangeSubsidiary(selectedOption)}
                            options={data_subsidiary}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col md="2">
                        <label>Setor</label>
                        <Select
                            name="param_sector"
                            id="param_sector"
                            disabled={!(data_sector.length > 0)}
                            clearable={false}
                            value={param_sector}
                            onChange={this.handleChangeSetor}
                            options={data_sector}
                            placeholder="Selecione"
                        />
                    </Col>
                </Row>
                <br />
                {show_publishers == true &&
                    <Row>
                        <Col md='12'>
                            <Nav tabs className='marketshare-tab-charts'>
                                <NavItem>
                                    <NavLink className={classnames({ active: active_tab === 'publishers' })} onClick={() => { this.toggle('publishers') }} >
                                        Editoras
                                    </NavLink>
                                </NavItem>
                                <NavItem className={show_collections ? '' : 'd-none'}>
                                    <NavLink className={classnames({ active: active_tab === 'collections' })} onClick={() => { this.toggle('collections') }} >
                                        Coleções
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={active_tab} className='marketshare-cont-charts'>
                                <TabPane tabId='publishers'>
                                    <Row>
                                        <Card style={{ width: "100%" }}>
                                            <CardHeader className={param_type == 'ESCOLA' ? 'd-none' : ''}>
                                                <Col md="4">
                                                    <Select
                                                        name="param_city"
                                                        id="param_city"
                                                        disabled={!(data_city.length > 1)}
                                                        clearable={false}
                                                        value={param_city}
                                                        onChange={this.handleChangeCity}
                                                        options={data_city}
                                                        placeholder="Selecione"
                                                    />
                                                </Col>
                                            </CardHeader>
                                            <CardBody>
                                                <Chart
                                                    chartType='PieChart'
                                                    data={data_publisher}
                                                    options={pieOptions}
                                                    graph_id='PieChartPlublishers'
                                                    width='100%'
                                                    height='400px'
                                                    legend_toggle
                                                />
                                            </CardBody>
                                        </Card>
                                    </Row>
                                </TabPane>
                                <TabPane tabId='collections'>
                                    <Row>
                                        <Card style={{ width: "100%" }}>
                                            <CardBody>
                                                <Chart
                                                    chartType='PieChart'
                                                    data={data_collection}
                                                    options={pieOptions}
                                                    graph_id='PieChartCollections'
                                                    width='100%'
                                                    height='400px'
                                                    legend_toggle
                                                />
                                            </CardBody>
                                        </Card>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}

export default MarketShare;