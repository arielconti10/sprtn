import React, { Component } from 'react'
import axios from '../../../app/common/axios';
import { Link } from 'react-router-dom';
import { Collapse, Card, CardHeader, CardFooter, CardBody, CardTitle, CardText, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import ContactForm from '../Contact/ContactForm';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import SchoolForm from './SchoolForm';

const apiSpartan = 'contact';

class SchoolConctactList extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {             
            page: 1,
            pageSize: 10,
            data: this.props.contacts,
            filtered: [],
            sorted: [],
            pages: null,
            loading: false,
            columns: [],
            contact_find: [],

            collapse: false,
            blockButton: false,
            back_error: '',
            submit_button_disabled: false,
            new: true, 
            school_id: this.props.schoolId
        };
    }

    toggle() {

        this.setState({collapse: !this.state.collapse}, function () {
            if (this.state.collapse == true) {
                this.setState({blockButton:true});
            } else {
                this.setState({blockButton:false});
            }
        });

    }

    componentWillMount() {
        // console.log(this.props.contacts);
    }

    componentWillReceiveProps() {
        this.setState({data:this.props.contacts});
    }

    onClickEdit(element) {
        const values = this.state;
        values.contact_find = element.value;
        this.setState({values});
        this.toggle();
    }

    onClickCancel() {
        const values = this.state;
        values.contact_find = [];
        this.setState({values});
        this.toggle();
    }

    onClickDelete(element) {
        const { id } = element.value;

        axios.delete(`${apiSpartan}/${id}`)
        .then(res => {
            this.updateTable();
        }).catch(function (error) {
            console.log(error)
        }.bind(this));
    }
    

    componentDidMount() {
        let col = [
            { Header: "Nome", accessor: "name", headerClassName: 'text-left' },
            { Header: "E-mail", accessor: "email", headerClassName: 'text-left' },
            { Header: "Cargo", accessor: "job_title.name", headerClassName: 'text-left' },
            {
                Header: "Telefone",
                id: "phone",
                width: 380,
                accessor: d => {
                    let phones = "";
                    if (d.phones !== undefined) {
                        d.phones.forEach(element => {
                            let item_phone = `${element.phone_extension} ${element.phone_number} (${element.phone_type})`;
                            phones = phones + item_phone + ", ";
                        });
                        phones = phones.trim();
                        phones = phones.substring(0, phones.length - 1);
                    }
                    
                    return phones;
                }
            }
        ];

        col.push(
            {
                Header: "Status",
                accessor: "",
                width: 60,
                headerClassName: 'text-left',
                sortable: false,
                Cell: (element) => (
                    !element.value.deleted_at ?
                        <div><span>Ativo</span></div>
                        :
                        <div><span>Inativo</span></div>
                )
            }, {
                Header: "Ações", accessor: "", sortable: false, width: 90, headerClassName: 'text-left', Cell: (element) => (
                    !element.value.deleted_at ?
                        <div>
                            <button className='btn btn-primary btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickEdit(element)}>
                                <i className='fa fa-pencil'></i>
                            </button>

                            <button className='btn btn-danger btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickDelete(element)}>
                                <i className='fa fa-ban'></i>
                            </button>
                        </div>
                        :
                        <div>
                            <button className='btn btn-success btn-sm' disabled={this.state.blockButton} onClick={() => this.onClickActive(element)}>
                                <i className='fa fa-check-circle'></i>
                            </button>
                        </div>

                )
            }
        )

        this.setState({ columns: col });
        console.log(this.state.data);
    }

    updateTable() {
        axios.get(`school/${this.props.schoolId}`)
        .then(response => {
            const dados = response.data.data;
            this.setState({              
                data: dados.contacts || []
            });
        })
        // this.toggle();
    }

    render() {
        const { data, pageSize, page, loading, pages, columns } = this.state;

        return (
            <div>
                    <Collapse isOpen={this.state.collapse}>
                        <Card>
                            <CardBody>
                                <ContactForm schoolId={this.props.schoolId} contact_find={this.state.contact_find} 
                                    updateTable={this.updateTable.bind(this)} toggle={this.toggle.bind(this)}
                                    onClickCancel={this.onClickCancel.bind(this)} />
                            </CardBody>
                        </Card>
                    </Collapse>

                    <button className='btn btn-primary' disabled={this.state.blockButton} onClick={this.toggle}>
                        Adicionar
                    </button>

                    <br/>
                    <Row>
                        <Col md="12">
                            <ReactTable
                                columns={columns}
                                data={data}
                                // pages={pages}
                                loading={loading}
                                defaultPageSize={pageSize}
                                // manual
                                // onFetchData={this.onFetchData}
                                // previousText='Anterior'
                                // nextText='Próximo'
                                loadingText='Carregando...'
                                noDataText='Sem registros'
                                // pageText='Página'
                                ofText='de'
                                rowsText=''
                                className='-striped -highlight'
                            />
                        </Col>
                    </Row>
            </div>
        )
    }
}

export default SchoolConctactList;