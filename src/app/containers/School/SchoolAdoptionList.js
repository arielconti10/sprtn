import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import axios from 'axios';
import axiosSpartan from '../../common/axios';
const apiAdocoes = 'https://fluigapi.ftd.com.br/v1/adocoes';
const apiSpartan = 'http://hapi.spartan.ftd.com.br/api'

class SchoolAdoptionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 5,
            data: [],
            filtered: [],
            sorted: [],
            pages: null,
            loading: false,
            columns: [],

            schoolId: this.props.schoolId,
            school_code_totvs: this.props.schoolCodeTotvs,
            subsidiary_id: this.props.subsidiaryId,
            sector_id: this.props.sectorId
        };
    }

    componentWillMount() {
        axiosSpartan.get(`${apiSpartan}/school/${this.state.schoolId}`)
            .then((response) => {
                const dados = response.data.data;

                let school_code_totvs = dados.school_code_totvs;
                let baseURL = `${apiAdocoes}?filter[cd_escola]=${school_code_totvs}`;

                axios.get(baseURL)
                    .then((response) => {
                        const dados = response.data
                        
                        this.setState({ data: dados });
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        let col = [
            { Header: "cd_nivel", accessor: "cd_nivel", headerClassName: 'text-left' },
            { Header: "cd_series", accessor: "cd_series", headerClassName: 'text-left' },
            { Header: "qt_alunos", accessor: "qt_alunos", headerClassName: 'text-left' },
            { Header: "cd_disci", accessor: "cd_disci", headerClassName: 'text-left' },
            { Header: "cd_fm_disci", accessor: "cd_fm_disci", headerClassName: 'text-left' },
            { Header: "seq_disci", accessor: "seq_disci", headerClassName: 'text-left' },
            { Header: "ano_troca", accessor: "ano_troca", headerClassName: 'text-left' },
            { Header: "cd_livro", accessor: "cd_livro", headerClassName: 'text-left' },
            { Header: "ano_troca", accessor: "ano_troca", headerClassName: 'text-left' },
            { Header: "autor", accessor: "autor", headerClassName: 'text-left' },
            { Header: "editora", accessor: "editora", headerClassName: 'text-left' },
            { Header: "series", accessor: "series", headerClassName: 'text-left' },
            { Header: "disciplina", accessor: "disciplina", headerClassName: 'text-left' },
            { Header: "titulo", accessor: "titulo", headerClassName: 'text-left' },
            { Header: "adota_1ano", accessor: "adota_1ano", headerClassName: 'text-left' },
            { Header: "adota_2anos", accessor: "adota_2anos", headerClassName: 'text-left' },
            { Header: "adota_3anos", accessor: "adota_3anos", headerClassName: 'text-left' },
            { Header: "adota_4anos", accessor: "adota_4anos", headerClassName: 'text-left' },
            { Header: "ano_apuracao", accessor: "ano_apuracao", headerClassName: 'text-left' }
        ];

        this.setState({ columns: col });
    }

    onFetchData = (state, instance, deleted_at) => {

        let pageSize = state ? state.pageSize : this.state.pageSize;
        let page = state ? state.page + 1 : this.state.page;

        let sorted = state ? state.sorted : this.state.sorted
        let filtered = state ? state.filtered : this.state.filtered

        let baseURL = `${apiAdocoes}?filter[cd_escola]=${this.state.school_code_totvs}`;//&filter[cod_estabel]=${this.state.subsidiary_id}&filter[setor]=${this.state.sector_id}`;

        //To do: make filter to deleted_at
        /*console.log('onFetchData:', deleted_at);
        if(deleted_at != 'all')
            console.log("deleted_at != 'all'", deleted_at);*/

        filtered.map(function (item) {
            baseURL += `&filter[${item.id}]=${item.value}`;
        })

        for (let i = 0; i < sorted.length; i++) {
            baseURL += "&order[" + sorted[i]['id'] + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
        }

        axios.get(baseURL)
            .then((response) => {
                const dados = response.data
                
                this.setState({
                    data: dados,
                    totalSize: dados.length,
                    // pages: response.data.meta.pagination.last_page,
                    // page: response.data.meta.pagination.current_page,
                    // pageSize: parseInt(response.data.meta.pagination.per_page),
                    sorted: sorted,
                    filtered: filtered,
                    loading: false
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { data, pageSize, page, loading, pages, columns } = this.state;

        return (
            <div>
                <div>
                    <Row>
                        <Col md="12">
                            <ReactTable
                                columns={columns}
                                data={data}
                                defaultPageSize={pageSize}
                                filterable
                                defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
                                previousText='Anterior'
                                nextText='Próximo'
                                loadingText='Carregando...'
                                noDataText='Sem registros'
                                pageText='Página'
                                ofText='de'
                                rowsText=''
                                className='-striped -highlight'
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default SchoolAdoptionList;