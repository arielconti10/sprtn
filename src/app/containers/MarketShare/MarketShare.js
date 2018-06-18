import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select';
import { Chart } from 'react-google-charts';
import axios from '../../../app/common/axios';
import { canUser } from '../../common/Permissions';

import PieChartComponent from '../../common/PieChartComponent';

import './MarketShare.css'

const apiUserCurrent = 'user/current';
const apiHierarchy = 'hierarchy/childrens';
const paletteColors = ["#009ce5", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#000000", "#7D7D7D", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];

const pieOptions = {
    pieHole: 0.3,
    slices: [{ color: '#009ce5', }, { color: '#FD0006', }, { color: '#1aaf5d', }, { color: '#f45b00', }, { color: '#8e0000', }, { color: '#7D7D7D', }],
    // tooltip: { showColorCode: true },
    sliceVisibilityThreshold: 0,
    chartArea: { width: "100%", height: "70%" },
    legend: { alignment: 'center' }
};

const barOptions = {
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
            show_disciplines: false,
            ring_load: false,

            user_subsidiary: 0,
            user_sector: 0,

            param_subsidiary: '',
            param_sector: '',
            param_city: '',
            param_type: '',
            param_year: '',

            param_secretary: {},

            data_year: [{ value: '2016', label: '2016' }],
            data_type: [],
            data_subsidiary: [],
            data_sector: [],
            data_city: [],
            data_city_header: [],
            data_publisher: [['EDITORAS', '%']],
            data_collection: [['COLEÇÕES', '%']],
            data_discipline: [['Coleções', '%', { 'role': 'style' }], ['', 0, '']]
        };

        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.publisherChart = this.publisherChart.bind(this);
        this.collectionChart = this.collectionChart.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentWillMount() {
        canUser('marketshare.view', this.props.history, "view");
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
            data_collection: [['COLEÇÕES', '%']],
            show_disciplines: false,
            data_discipline: [['Coleções', '%', { 'role': 'style' }], ['', 0, '']]
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

            // console.log('user:', user)

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
    
    ftdToUp(array, isSchool) {
        let pubFTD = null;
        let others = 0;
        let values = [];
        let positionArray = isSchool? 0 : 1;
        let contMax = isSchool? 5 : 6;
        let cont = 0;

        array.map(item => {
            let label = isSchool ? item.key.split(':')[2] : item[0];
            let porcent = isSchool ? item.value : item[1];

            if (cont < contMax) {
                if (label.search("FTD") !== -1) {
                    pubFTD = [label, porcent];
                } else {
                    values.push([label, porcent]);
                }

                cont++;
            } else {
                others += porcent;
            }
        });

        if (others !== "") values.push(["OUTROS", others]);

        if (pubFTD) values.splice(positionArray, 0, pubFTD);

        return values;
    }

    getSchools(marketShare) {
        let publishers = this.state.data_publisher;

        let pub = this.ftdToUp(marketShare, true);
        pub.splice(0, 0, publishers[0]);
        
        let show_pub = pub.length > 2 ? true : false;

        this.setState({ data_publisher: pub, show_publishers: show_pub }, () => this.collectionChart());
    }

    getSecretaries(marketShare) {
        let cities = this.state.data_city;
        let cityHeaders = this.state.data_city_header;

        let paramSecretary = {};

        if (cities.length < 1) {
            marketShare.map(item => {
                let register = item.key.split(':');
                let city = register[2];

                let valueCity = {};
                valueCity['value'] = city;
                valueCity['label'] = city;

                cities.push(valueCity);
                cityHeaders.push(city);
            });

            cities = cities.filter((item, index, self) =>
                index === self.findIndex((obj) => (
                    obj.value === item.value
                ))
            );

            cityHeaders = cityHeaders.filter(function (item, pos) {
                return cityHeaders.indexOf(item) == pos;
            });

            cities.sort((a, b) => a.value.localeCompare(b.value));
            cityHeaders.sort((a, b) => a.localeCompare(b));

            this.setState({ data_city: cities, data_city_header: cityHeaders });
        }

        if (this.state.param_city == '') {
            let param = cities.length > 0 ? cities[0].value : '';
            this.setState({ param_city: param, data_city_header: cityHeaders })
        };

        let cont = 0;

        marketShare.map((item, i) => {
            let register = item.key.split(':');
            let city = register[2]
            let label = register[3];

            let array = paramSecretary[city] || [['SECRETARIAS', '%']];
            array.push([label, item.value]);

            paramSecretary[city] = array;

            cont = i;
        });

        let show_pub = cont > 0 ? true : false;

        this.setState({ show_publishers: show_pub, param_secretary: paramSecretary }, () => this.collectionChart());
    }

    publisherChart() {
        if (this.state.param_sector != '') {
            this.setState({ ring_load: true });

            let urlPost = `marketshare?filter[subsidiary.id]=${this.state.param_subsidiary}&filter[key]=${this.state.param_type}_EDITORAS_CONSOLIDADO:${this.state.param_sector}:&filter[year]=${this.state.param_year}`;

            axios.get(`${urlPost}`).then(response => {
                let marketShare = response.data.data;
                let isSchool = this.state.param_type == 'ESCOLA' ? true : false;

                marketShare.sort((a, b) => a.value - b.value).reverse();

                if (isSchool) {
                    this.getSchools(marketShare);
                } else {
                    this.getSecretaries(marketShare);
                }
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

            this.setState({ data_collection: collections, show_collections: show_col, ring_load: false }/*, () => this.disciplineChart()*/);

        }).catch(err => console.log(4, err));
    }

    disciplineChart() {
        let urlPost = `marketshare?filter[subsidiary.id]=${this.state.param_subsidiary}&filter[key]=ESCOLA_DISCIPLINAS_CONSOLIDADO:${this.state.param_sector}&filter[year]=${this.state.param_year}`;

        axios.get(`${urlPost}`).then(response => {
            let marketShare = response.data.data;
            let disciplines = this.state.data_discipline;
            let pubFTD = null;
            let others = 0;
            let isSchool = this.state.param_type == 'ESCOLA' ? true : false;

            marketShare.sort((a, b) => a.value - b.value).reverse();

            marketShare.map((item, i) => {
                let register = item.key.split(':');
                let discipline = register[2];
                let work = register[3]

                if (i < 5) {
                    // if (label.search("FTD") !== -1) {
                    //     pubFTD = [label, item.value, `color: ${paletteColors[0]}`];
                    // } else {
                    disciplines.push([label, item.value, `color: ${paletteColors[i + 1]}`]);
                    // }
                } else {
                    others += item.value;
                }
            });

            if (others !== "") disciplines.push(["OUTROS", others, `color: ${paletteColors[5]}`]);

            if (pubFTD) disciplines.splice(1, 0, pubFTD);

            let show_dis = disciplines.length > 2 ? true : false;

            this.setState({ data_discipline: disciplines, show_disciplines: show_dis, ring_load: false });

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
            data_city: [],
            data_city_header: []
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
            data_city: [],
            data_city_header: []
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
            data_city: [],
            data_city_header: []
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
            data_city: [],
            data_city_header: []
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
            data_publisher, data_collection, ring_load, show_publishers, col_secretaries, param_secretary,
            show_collections, show_disciplines, data_year, data_type, data_subsidiary, param_year,
            param_subsidiary, data_sector, data_city, data_city_header, param_sector, param_type,
            param_city, active_tab
        } = this.state;

        let secretaries;

        if (show_publishers && param_type != 'ESCOLA') {
            secretaries = data_city_header.map((city, i) => {

                // console.log('antes:', param_secretary[city]);
                let dataActions = this.ftdToUp(param_secretary[city], false);
                // console.log('depois:', dataActions);

                return (
                    <Col xl='6' md='12' sm='12'>
                        <PieChartComponent
                            data_actions={dataActions}
                            chart_id={`PieChartSecretary_${i}`}
                            options_publisher={pieOptions}
                            label_card={city}
                        />
                    </Col>
                )
            })
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

                <Row>
                    {show_publishers && param_type == 'ESCOLA' &&
                        <Col xl={show_collections ? '6' : '12'} md='12' sm='12'>
                            <PieChartComponent
                                data_actions={data_publisher}
                                chart_id="PieChartPlublishers"
                                options_publisher={pieOptions}
                                label_card="Editoras"
                            />
                        </Col>
                    }

                    {show_publishers && param_type != 'ESCOLA' &&
                        secretaries
                    }

                    {show_collections &&
                        <Col xl='6' md='12' sm='12'>
                            <PieChartComponent
                                data_actions={data_collection}
                                chart_id="PieChartCollections"
                                options_publisher={pieOptions}
                                label_card="Coleções"
                            />
                        </Col>
                    }

                </Row>

                {/* {show_publishers == true &&
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
                                <NavItem className={show_disciplines ? '' : 'd-none'}>
                                    <NavLink className={classnames({ active: active_tab === 'disciplines' })} onClick={() => { this.toggle('disciplines') }} >
                                        Disciplinas
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
                                <TabPane tabId='disciplines'>
                                    <Row>
                                        <Card style={{ width: "100%" }}>
                                            <CardBody>
                                                <Chart
                                                    chartType='BarChart'
                                                    data={data_collection}
                                                    options={barOptions}
                                                    graph_id='BarChartDisciplines'
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
                } */}
            </div>
        )
    }
}

export default MarketShare;