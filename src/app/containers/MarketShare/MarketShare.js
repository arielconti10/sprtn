import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardHeader } from 'reactstrap';
import Select from 'react-select';
import { RingLoader } from 'react-spinners';
import { Chart } from 'react-google-charts';
import axios from '../../../app/common/axios';
import { canUser } from '../../common/Permissions';

const apiPost = 'marketshare?filter[key]=_EDITORAS_CONSOLIDADO&filter[year]=2016';

const apiPostSubsidiary = 'subsidiary';
const apiPostSector = 'sector';

const pieOptions = {
    pieHole: 0.5,
    slices: [{ color: '#009de8', }, { color: '#FD0006', }, { color: '#1aaf5d', }, { color: '#f45b00', }, {
        color: '#8e0000',
    }, { color: '#7D7D7D', },],
    tooltip: {
        showColorCode: true,
    }
};

const vltypes = [{ value: 'ESCOLA', label: 'ESCOLA' }, { value: 'SECRETARIA', label: 'SECRETARIA' }];

class MarketShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subsidiary_param: 0,
            sector_param: 0,
            type_param: 0,

            datasubsidiary: [],
            data_sector: [],
            marketshare: [],
            schoolId: '0',
            data_publisher: [],
            show: '',
        };
        this.handleChangeSubsidiary = this.handleChangeSubsidiary.bind(this);
        this.chargeChart = this.marketShareChart.bind(this);
    }

    componentWillMount() {
        canUser('indicator.view', this.props.history, "view");
        this.setState({
            ringLoad: false
        });
    }

    loadSubsidiary() {
        axios.get(`${apiPostSubsidiary}`).then(response => {
            let subsidiary = response.data.data;
            var Data = [];
            subsidiary.map((item, i) => {
                Data.push({ value: item.id, label: item.name, sectors: item.sectors });
            });
            this.setState({ datasubsidiary: Data });
        }).catch(err => console.log(4, err));

        this.setState({
            ringLoad: false
        });
    }

    loadSector(sectors) {
        var Data = [];
        Data.push({ value: 'TODOS', label: 'TODOS' })
        sectors.map(item => {
            Data.push({ value: item.id, label: item.name });
        });
        this.setState({ data_sector: Data });
    }

    marketShareChart() {

        let initDataP = [['Editoras', '%']];
        let initDataC = [['Coleções', '%', { 'role': 'style' }], ['', 0, '']];
        this.setState({ ringLoad: true, data_publisher: initDataP });

        if (this.state.schoolId !== undefined) {

            let urlPost = 'marketshare?filter[key]=' + this.state.type_param + '_EDITORAS_CONSOLIDADO&filter[year]=2016';

            axios.get(`${urlPost}`).then(response => {

                let marketshare = response.data.data;
                marketshare.sort((a, b) => a.value - b.value);

                let publishers = this.state.data_publisher;
                let pubFTD = null;
                let aux = 0;
                let order = [];
                let vlother = 0;

                marketshare.map((item, i) => {
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
                let cont = 0;

                data_order.map((item, i) => {
                    let register = item.key.split(':');
                    let key = register[0];
                    let sector = register[1];
                    let label = register[2];

                    if (cont <= 4) {
                        if (this.state.subsidiary_param == item.subsidiary_id && sector == this.state.sector_param) {
                            if (label.search("FTD") !== -1) {
                                pubFTD = [label, item.value];
                            } else {
                                publishers.push([label, item.value,]);
                            }
                        }
                    } else {
                        vlother += item.value;
                    }
                    cont = cont + 1
                });
                if (vlother !== "") {
                    publishers.push(["Outros", vlother]);
                }
                if (pubFTD) {
                    publishers.splice(1, 0, pubFTD);
                }

                this.setState({
                    data_publisher: publishers,
                    ringLoad: false
                });

            }).catch(err => console.log(4, err));
        } else {
            this.setState({ ringLoad: false });
        }
    }

    handleChangeSubsidiary = (selectedOption) => {
        const values = this.state;
        values.subsidiary_param = selectedOption.value;
        this.setState({ values });
        this.loadSector(selectedOption.sectors);
        this.setState({ sector_param: '', show: '' });
    }

    handleChangeSetor = (selectedOption) => {
        const values = this.state;
        values.sector_param = selectedOption.value;
        this.setState({ values });
        this.setState({ show: '1' })
        this.marketShareChart(sector_param);
    }

    handleChangeType = (selectedOption) => {
        const values = this.state;
        values.type_param = selectedOption.value;
        this.setState({ values });
        this.setState({ subsidiary_param:'' ,sector_param: '', show: '' });
        this.loadSubsidiary();
    }

    render() {

        const { data_publisher, ringLoad, datasubsidiary, subsidiary_param, data_sector, sector_param, selectedOption, type_param } = this.state;
        return (
            <div className="animated fadeIn">
                <RingLoader
                    color={'#123abc'}
                    loading={ringLoad}
                    margin='50px'
                />
                <Row>
                    <Col md="2">
                        <label>Tipo</label>

                        <Select
                            name="type_param"
                            id="type_param"
                            clearable={false}
                            value={type_param}
                            onChange={(selectedOption) => this.handleChangeType(selectedOption)}
                            options={vltypes}
                            placeholder="Não há registros"
                        />
                    </Col>



                    <Col md="2">
                        <label>Filial</label>

                        <Select
                            name="subsidiary_param"
                            id="subsidiary_param"
                            disabled={!(datasubsidiary.length > 0)}
                            clearable={false}
                            value={subsidiary_param}
                            onChange={(selectedOption) => this.handleChangeSubsidiary(selectedOption)}
                            options={datasubsidiary}
                            placeholder="Não há registros"
                        />
                    </Col>
                    <Col md="2">
                        <label>Setor</label>
                        <Select
                            name="sector_param"
                            id="sector_param"
                            disabled={!(data_sector.length > 1)}
                            clearable={false}
                            value={sector_param}
                            onChange={this.handleChangeSetor}
                            options={data_sector}
                            placeholder="Não há registros"
                        />
                    </Col>
                </Row>
                <br />
                {this.state.show == '1' && (
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <span><strong>Editoras </strong></span>
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
                )}
            </div>
        )
    }
}

export default MarketShare;