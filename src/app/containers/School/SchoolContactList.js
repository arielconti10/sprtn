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

import { canUser } from '../../common/Permissions';


class SchoolConctactList extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {             
            viewMode: this.props.viewMode,
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

    componentWillReceiveProps() {
        this.checkPermission();
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

        let resp = confirm("Deseja realmente excluir este registro?");
        if (resp == true) {
            axios.delete(`${apiSpartan}/${id}`)
            .then(res => {
                this.updateTable();
            }).catch(function (error) {
                console.log(error)
            }.bind(this));
        }
    }

    addNew() {
        this.setState({contact_find:[]});
        this.setState({contact_id: ''});
        this.toggle();
    }

    onClickActive(element) {
        const { id, name ,job_title_id, phones } = element.value;

        element.value.phones.map(item => {
            if (item.phone_extension == "") {
                delete item.phone_extension;
            }
        });

        axios.put(`${apiSpartan}/${id}`, {
            'school_id': this.props.schoolId,
            'name': name,
            'job_title_id': job_title_id,
            'phones': phones,
            'active': true
        }).then(res => {
            this.updateTable();
        }).catch(function (error) {
            console.log(error)
        }.bind(this));
    }

    renderEditable(cellInfo) {
        try {
            return (
                <div
                //   style={{ backgroundColor: "#fafafa" }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ data });
                  }}
                  dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                  }}
                />
            )
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {

        let col = [
            { Header: "Nome", accessor: "name", headerClassName: 'text-left'},
            { Header: "Cargo", accessor: "job_title.name", headerClassName: 'text-left' },
            { Header: "E-mail", accessor: "email", headerClassName: 'text-left' },
            {
                Header: "Telefone",
                id: "phone",
                width: 380,
                accessor: d => {
                    let phones = "";
                    if (d.phones !== undefined) {
                        d.phones.forEach(element => {
                            let type_text = "";
                            if (element.phone_type == "work") {
                                type_text = "Trabalho";
                            } else if (element.phone_type == "home") {
                                type_text = "Casa";
                            } else if (element.phone_type == "mobile") {
                                type_text = "Celular";
                            } else {
                                type_text = "Fax";
                            }
                            let item_phone = `${element.phone_number} (${type_text})`;
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
                headerClassName: 'text-left',
                sortable: false,
                Cell: (element) => (
                    !element.value.deleted_at ?
                    <div><span className="alert-success grid-record-status">Ativo</span></div>
                    :
                    <div><span className="alert-danger grid-record-status">Inativo</span></div>
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

    checkPermission() {
        canUser('school.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));
    }

    render() {
        const { data, pageSize, page, loading, pages, columns } = this.state;

        return (
            <div>
                <div>
                    <Collapse isOpen={this.state.collapse}>
                        <Card>
                            <CardBody>
                                <ContactForm schoolId={this.props.schoolId} contact_find={this.state.contact_find} 
                                    updateTable={this.updateTable.bind(this)} toggle={this.toggle.bind(this)}
                                    onClickCancel={this.onClickCancel.bind(this)} 
                                    viewMode={this.state.viewMode} />
                            </CardBody>
                        </Card>
                    </Collapse>

                    <button className='btn btn-primary' disabled={this.state.viewMode} onClick={this.addNew.bind(this)}>
                        Adicionar
                    </button>
                </div>
                <div>
                    <br/>
                    <Row>
                        <Col md="12">
                            <ReactTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                defaultPageSize={pageSize}
                                loadingText='Carregando...'
                                noDataText='Sem registros'
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

export default SchoolConctactList;