import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import axios from '../../../app/common/axios';
import { canUser } from '../../common/Permissions';
import PieChartComponent from '../../common/PieChartComponent';
import ColChartComponent from '../../common/ColChartComponent';

import './MarketShare.css'

const apiUserCurrent = 'user/current';
const apiHierarchy = 'hierarchy/childrens';
const paletteColors = ["#009ce5", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#7D7D7D", "#000000", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];

const pieOptions = {
    pieHole: 0.3,
    slices: [{ color: '#009ce5', }, { color: '#FD0006', }, { color: '#1aaf5d', }, { color: '#f45b00', }, { color: '#8e0000', }, { color: '#7D7D7D', }],
    sliceVisibilityThreshold: 0,
    chartArea: { width: "100%", height: "70%" },
    legend: { alignment: 'center' }
};

class MarketShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_role: '',

            active_tab: 'publishers',

            show_no_register: false,
            show_publishers: false,
            show_collections: false,
            show_disciplines: false,
            ring_load: false,

            user_subsidiary: 0,
            user_sector: 0,

            param_subsidiary: '',
            param_sector: '',
            param_type: '',
            param_year: '',
            param_error: '',

            param_secs: {},
            param_secretary: {},
            param_discipline: {},

            data_year: [{ value: '2016', label: '2016' }],
            data_type: [],
            data_subsidiary: [],
            data_sector: [],
            data_city_header: [],
            data_discipline_header: [],
            data_publisher: [['EDITORAS', '%']],
            data_collection: [['COLEÇÕES', '%']],
            data_discipline: [['DISCIPLINAS', '%', { role: 'annotation' }, { 'role': 'style' }], ['', 0, '']]
        };

        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.publisherChart = this.publisherChart.bind(this);
        this.collectionChart = this.collectionChart.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentWillMount() {
        canUser('marketshare.view', this.props.history, "view");
        this.handleChangeYear({ value: '2016' });
        this.handleChangeType({ value: 'ESCOLA' });
    }

    clearData() {
        this.setState({
            show_publishers: false,
            data_publisher: [['EDITORAS', '%']],
            show_collections: false,
            data_collection: [['COLEÇÕES', '%']],
            show_disciplines: false,
            data_discipline: [['DISCIPLINAS', '%', { role: 'annotation' }, { 'role': 'style' }], ['', 0, '']]
        });
    }

    loadType() {
        this.setState({
            data_type: [
                { value: 'ESCOLA', label: 'ESCOLA' },
                { value: 'SECRETARIA', label: 'SECRETARIA' },
                { value: 'ESCOLA_DISCIPLINAS', label: 'DISCIPLINAS' }
            ]
        });
    }

    createSelectValues(obj, user) {
        let param = {};
        param['label'] = `${obj.name} ${user ? ' (' + user + ')': ''}`;
        param['name'] = obj.name;
        param['value'] = obj.code;
        param['code'] = obj.code;

        return param;
    }

    loadSubsidiary() {
        axios.get(`${apiUserCurrent}`).then(response => {
            let user = response.data.data;
            let roleCode = user.role.code;
            let data = [];
            let paramSector = {};

            this.setState({ user_role: roleCode });

            axios.get(`${apiHierarchy}`).then(response => {
                let subordinates = response.data.data;
                let subsidiaries = [];
                let arrSectors = [];

                subordinates.map(user => {
                    if (user.subsidiary) {
                        subsidiaries.push(user.subsidiary);

                        let arr = paramSector[user.subsidiary_id] || [];
                        arr.push(this.createSelectValues(user.sector, user.full_name));
                        paramSector[user.subsidiary_id] = arr;
                    }
                });

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
                if (data.length) {
                    this.setState({ show_no_register: false, data_subsidiary: data, param_subsidiary: data[0].value, param_secs: paramSector }, this.loadSector(paramSector, data[0].value));
                } else {
                    this.setState({ show_no_register: true });
                }

            }).catch(err => {
                console.log(4, err);
                let data_error = err.response.data.errors;
                let filterId = Object.keys(data_error)[0].toString();
                this.setState({ show_no_register: true, param_error: `(${data_error[filterId]})` });
            });

            if (data.length) {
                this.setState({ show_no_register: false, data_subsidiary: data, param_subsidiary: data[0].value, param_secs: paramSector }, () => this.loadSector(paramSector, data[0].value));
            } else {
                this.setState({ show_no_register: true });
            }
        }).catch(err => {
            console.log(4, err);
            let data_error = err.response.data.errors;
                let filterId = Object.keys(data_error)[0].toString();
            this.setState({ show_no_register: true, param_error: `(${data_error[filterId]})` });
        });

        this.setState({ ring_load: false });
    }

    loadSector(paramSector, subsidiary) {
        let data = [];
        let sec = '';
        
        data = paramSector[subsidiary].sort((a, b) => a['label'].localeCompare(b['label']));
        sec = paramSector[subsidiary][0].code;

        this.setState({ data_sector: data, param_sector: sec, param_subsidiary: subsidiary }, () => this.publisherChart());
    }

    ftdToUp(array, isSchool) {
        let pubFTD = null;
        let others = 0;
        let values = [];
        let positionArray = isSchool ? 0 : 1;
        let contMax = isSchool ? 5 : 6;
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

        marketShare = marketShare.filter((item, index, self) =>
            index === self.findIndex((obj) => (
                obj.key === item.key
            ))
        );

        let pub = this.ftdToUp(marketShare, true);
        pub.splice(0, 0, publishers[0]);

        let show_pub = pub.length > 2 ? true : false;

        this.setState({ data_publisher: pub, show_publishers: show_pub }, () => this.collectionChart());
    }

    getSecretaries(marketShare) {
        let cityHeaders = this.state.data_city_header;

        let paramSecretary = {};

        if (cityHeaders.length < 1) {
            marketShare.map(item => {
                console.log('item.key:', item.key);
                let register = item.key.split(':');
                let city = register[2];

                let valueCity = {};
                valueCity['value'] = city;
                valueCity['label'] = city;

                cityHeaders.push(city);
            });

            cityHeaders = cityHeaders.filter(function (item, pos) {
                return cityHeaders.indexOf(item) == pos;
            });

            cityHeaders.sort((a, b) => a.localeCompare(b));

            this.setState({ data_city_header: cityHeaders });
        }

        this.setState({ data_city_header: cityHeaders })

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

            console.log('this.state.param_subsidiary:', this.state.param_subsidiary)

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
        let urlPost = `marketshare?filter[subsidiary.id]=${this.state.param_subsidiary}&filter[key]=${this.state.param_type}_COLECOES_CONSOLIDADO:${this.state.param_sector}:&filter[year]=${this.state.param_year}`;

        axios.get(`${urlPost}`).then(response => {
            let marketShare = response.data.data;
            let collections = this.state.data_collection;

            marketShare.sort((a, b) => a.value - b.value).reverse();

            let coll = this.ftdToUp(marketShare, true);
            coll.splice(0, 0, collections[0]);

            let show_col = coll.length > 3 ? true : false;

            this.setState({ data_collection: coll, show_collections: show_col, ring_load: false }, () => this.disciplineChart());

        }).catch(err => console.log(4, err));
    }

    disciplineChart() {
        let urlPost = `marketshare?filter[subsidiary.id]=${this.state.param_subsidiary}&filter[key]=${this.state.param_type}_CONSOLIDADO:${this.state.param_sector}:&filter[year]=${this.state.param_year}`;

        axios.get(`${urlPost}`).then(response => {
            let marketShare = response.data.data;

            let disciplineHeaders = this.state.data_discipline_header;

            let paramDiscipline = {};

            if (disciplineHeaders.length < 1) {
                marketShare.map(item => {
                    let register = item.key.split(':');
                    let discipline = register[2];

                    let valueDiscipline = {};
                    valueDiscipline['value'] = discipline;
                    valueDiscipline['label'] = discipline;

                    disciplineHeaders.push(discipline);
                });

                disciplineHeaders = disciplineHeaders.filter(function (item, pos) {
                    return disciplineHeaders.indexOf(item) == pos;
                });

                disciplineHeaders.sort((a, b) => a.localeCompare(b));

                this.setState({ data_discipline_header: disciplineHeaders });
            }

            this.setState({ data_discipline_header: disciplineHeaders })

            let cont = 0;

            marketShare.sort((a, b) => a.value - b.value).reverse();

            marketShare.map((item, i) => {
                let register = item.key.split(':');
                let discipline = register[2]
                let label = register[3];

                let array = paramDiscipline[discipline] || [['DISCIPLINAS', '%', { role: 'annotation' }, { 'role': 'style' }]];
                array.push([label, item.value, item.value]);

                paramDiscipline[discipline] = array;

                cont = i;
            });

            let show_dis = cont > 0 ? true : false;

            this.setState({ show_disciplines: show_dis, param_discipline: paramDiscipline, ring_load: false });

        }).catch(err => console.log(4, err));
    }

    handleChangeYear = (selectedOption) => {
        const values = this.state;
        values.param_year = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.setState({
            param_type: 'ESCOLA',
            param_subsidiary: '',
            param_sector: '',
            data_type: [{ value: 'ESCOLA', label: 'ESCOLA' }, { value: 'SECRETARIA', label: 'SECRETARIA' }, { value: 'ESCOLA_DISCIPLINAS', label: 'DISCIPLINAS' }],
            data_subsidiary: [],
            data_sector: [],
            data_city_header: [],
            data_discipline_header: []
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
            data_subsidiary: [],
            data_sector: [],
            data_city_header: [],
            data_discipline_header: []
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
            data_sector: [],
            data_city_header: [],
            data_discipline_header: []
        });
        this.loadSector(this.state.param_secs, values.param_subsidiary);
    }

    handleChangeSetor = (selectedOption) => {
        const values = this.state;
        values.param_sector = selectedOption.value;
        this.setState({ values });
        this.clearData();
        this.setState({
            data_city_header: [],
            data_discipline_header: []
        });
        this.publisherChart();
    }

    render() {
        const {
            data_publisher, data_collection, ring_load, show_publishers, param_secretary, param_error,
            show_collections, show_disciplines, show_no_register, data_year, data_type, data_subsidiary, param_year,
            param_subsidiary, data_sector, data_city_header, param_discipline, data_discipline_header,
            param_sector, param_type
        } = this.state;

        let secretaries;
        let disciplines;

        if (show_publishers && param_type != 'ESCOLA') {
            secretaries = data_city_header.map((city, i) => {

                let dataActions = this.ftdToUp(param_secretary[city], false);

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
            })
        }

        if (show_disciplines) {
            disciplines = data_discipline_header.map((discipline, i) => {

                let font = param_discipline[discipline].length > 13 ? 6 : 11;

                let colOptions = {};
                colOptions['chartArea'] = { width: "70%", height: "70%" };
                colOptions['legend'] = { position: "none" };
                colOptions['bar'] = { groupWidth: "80%" };
                colOptions['hAxis'] = { textStyle: { fontSize: font } };

                let valColor = 0;
                let maxColors = paletteColors.length - 1;

                param_discipline[discipline].map((item, i) => {
                    if (i != 0) {
                        if (valColor > maxColors) valColor = 0;

                        item.push(`color: ${paletteColors[valColor]}`);

                        valColor++;
                    }
                })

                return (
                    <Col xl='6' md='6' sm='12' xs='12' key={i}>
                        <ColChartComponent
                            data_actions={param_discipline[discipline]}
                            chart_id={`ColChartDiscipline_${i}`}
                            options={colOptions}
                            label_card={discipline}
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
                    <Col xl='2' md='2' sm='12' xs='12'>
                        <label>Ano</label>
                        <Select
                            name="param_year"
                            id="param_year"
                            disabled={!(data_year.length > 1)}
                            clearable={false}
                            value={param_year}
                            onChange={this.handleChangeYear}
                            options={data_year}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col xl='2' md='2' sm='12' xs='12'>
                        <label>Tipo</label>

                        <Select
                            name="param_type"
                            id="param_type"
                            disabled={show_no_register}
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
                            disabled={!(data_subsidiary.length > 1)}
                            clearable={false}
                            value={param_subsidiary}
                            onChange={(selectedOption) => this.handleChangeSubsidiary(selectedOption)}
                            options={data_subsidiary}
                            placeholder="Selecione"
                        />
                    </Col>

                    <Col xl='5' md='5' sm='12' xs='12'>
                        <label>Setor</label>
                        <Select
                            name="param_sector"
                            id="param_sector"
                            disabled={!(data_sector.length > 1)}
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
                        <Col xl={show_collections ? '6' : '12'} md={show_collections ? '6' : '12'} sm='12' xs='12'>
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
                        <Col xl='6' md='12' sm='12' xs='12'>
                            <PieChartComponent
                                data_actions={data_collection}
                                chart_id="PieChartCollections"
                                options_publisher={pieOptions}
                                label_card="Coleções"
                            />
                        </Col>
                    }

                    {show_disciplines &&
                        disciplines
                    }

                    {show_no_register &&
                        <div className='no-register'>
                            <span><i className='fa fa-exclamation-circle'></i> Não há registros a serem exibidos!</span><br/>
                            <span>{param_error}</span>
                        </div>
                    }
                </Row>
            </div>
        )
    }
}

export default MarketShare;