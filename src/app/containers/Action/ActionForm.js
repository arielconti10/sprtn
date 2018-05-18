import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from '../../../app/common/axios';

import { Row, Col, Card, CardHeader, CardFooter, CardBody, Button, Label, Input, Table } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';
import ReactTable from 'react-table'

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

import { canUser } from '../../common/Permissions';

const apiPost = 'action';

const apis = [
    { stateArray: 'school_types', api: 'school-type' },
    { stateArray: 'visit_types', api: 'visit-type' }
];

const selectsValidade = [
    { name: 'school_type_id', stateArray: 'school_types' },
    { name: 'visit_type_id', stateArray: 'visit_types' }
];

class ActionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewMode: false,
            page: 1,
            pageSize: 5,
            columns: [],

            name: '',
            active: true,
            visit_types: [],
            school_types: [],
            school_type_id: [],
            visit_type_id: [],

            valid_select_school_type_id: 1,
            valid_select_visit_type_id: 1,

            tableData: [],

            back_error: '',
            submitButtonDisabled: false,
            saved: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSchoolType = this.handleChangeSchoolType.bind(this);
        this.handleChangeVisitType = this.handleChangeVisitType.bind(this);

        this.clearSelects = this.clearSelects.bind(this);
        this.saveData = this.saveData.bind(this);
        this.validSelects = this.validSelects.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.getVisitType = this.getVisitType.bind(this);
        this.getSchoolType = this.getSchoolType.bind(this);

        this.onClickDelete = this.onClickDelete.bind(this);
    }

    componentDidMount() {
        this.createTypeTable();

        apis.map(item => {
            axios.get(`${item.api}?order[name]=asc`)
                .then(response => {
                    let dados = response.data.data;
                    dados.map(item => {
                        item['value'] = item.id,
                        item['label'] = item.name
                    });
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(err => console.log(err));
        });
    }

    getVisitType(element){
        let visitType = this.state.visit_types.map(item => {
            if(item.id === element.original.visit_type_id)
                return item.name;
        });

        return visitType;
    }

    getSchoolType(element){
        let schoolType = this.state.school_types.map(item => {
             if(item.id === element.original.school_type_id){
                return item.name;
            }
        });

        return schoolType;
    }

    createTypeTable(){
        let col = [            
            {
                Header: "Ações", accessor: "", sortable: false, width: 50, headerClassName: 'text-left', Cell: (element) =>
                    (
                        <button type="button" className='btn btn-danger btn-sm' onClick={() => this.onClickDelete(element)}>
                            <i className='fa fa-ban'></i>
                        </button>
                            
                    )
            },
            { Header: "Tipo de visita", accessor: "visit_type_id", headerClassName: 'text-left', Cell: (element) =>  (<span>{this.getVisitType(element)}</span>)},
            { Header: "Tipo de escola", accessor: "school_type_id", headerClassName: 'text-left', Cell: (element) =>  (<span>{this.getSchoolType(element)}</span>)}
        ];

        this.setState({ columns: col });
    }

    checkPermission(permission) {
        canUser(permission, this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
                console.log(this.state.viewMode);
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission('action.insert');
        if (this.props.match.params.id !== undefined) {
            this.checkPermission('action.update');
            axios.get(`${apiPost}/${this.props.match.params.id}`)
                .then(response => {
                    const dados = response.data.data;

                    let visit_type_school_type = []

                    if(dados.visit_type_school_type.length > 1){
                        dados.visit_type_school_type.map(item => {
                            let objectData = {};
                            objectData['visit_type_id'] = parseInt(item.visit_type.id);
                            objectData['school_type_id'] = parseInt(item.school_type.id);

                            visit_type_school_type.push(objectData);
                        });
                    }

                    this.setState({
                        name: dados.name,
                        active: dados.deleted_at === null ? true : false,
                        tableData: visit_type_school_type
                    });
                })
                .catch(err => console.log(err));
        }
    }

    clearSelects(){
        this.setState({
            school_type_id: [],
            visit_type_id: [],
            valid_select_school_type_id: 1,
            valid_select_visit_type_id: 1
        });
    }

    validSelects(){
        // Validate selects 
        let stopSubmit = false;
        selectsValidade.map(select => {
            let objState = `valid_select_${select.name}`;
            let objSelect = this.state[select.name];
            let objArray = this.state[select.stateArray];

            if (objSelect === undefined || objSelect == 0 || objSelect.length < 1) {
                this.setState({ [objState]: 0, submitButtonDisabled: true });
                stopSubmit = true;
            } else {
                let disabledValue = false

                objArray.map(elem => {
                    objSelect.map(obj =>{
                        if (elem['id'] === obj) {
                            disabledValue = true;
                        }
                    })
                });

                if (!disabledValue) {
                    this.setState({ [objState]: 0, submitButtonDisabled: true });
                    stopSubmit = true;
                } else {
                    this.setState({ [objState]: 1 });
                }
            }
        });

        if (stopSubmit) {
            return;
        }

        this.saveData();
    }

    pesquisa(visit, school){
        let objectArray = this.state.tableData;

        return objectArray.find(function (obj) { return obj.visit_type_id === visit &&  obj.school_type_id === school; });

        
    }

    saveData(){
        let objectArray = this.state.tableData;
        let arrayVisitType = this.state.visit_type_id;
        let arraySchoolType = this.state.school_type_id;

        let newArray = [];

        arrayVisitType.map(visit => {
            arraySchoolType.map(school => {

                if(!(this.pesquisa(visit, school))){
                    let objectData = {};
                    objectData['visit_type_id'] = parseInt(visit);
                    objectData['school_type_id'] = parseInt(school);

                    objectArray.push(objectData);
                }

                
                // if(objectArray.length > 0){
                //     objectArray.map(original => {
                //         console.log('objectArray:', objectArray)
                //         console.log('newArray:', newArray)

                //         console.log('original.visit_type_id:', original.visit_type_id, 'visit:', visit)
                //         console.log('original.school_type_id:', original.school_type_id, 'school:', school)
                //         console.log(original.visit_type_id === visit && original.school_type_id === school)

                //         if(original.visit_type_id === visit && original.school_type_id === school){
                //             return;
                //         }
                //         let objectData = {};
                //         objectData['visit_type_id'] = parseInt(visit);
                //         objectData['school_type_id'] = parseInt(school);
        
                //         objectArray.push(objectData);
                //         newArray.push(objectData);

                //         console.log('objectArray:', objectArray)
                //     });
                // } else  {
                //     console.log('else')
                //     let objectData = {};
                //     objectData['visit_type_id'] = parseInt(visit);
                //     objectData['school_type_id'] = parseInt(school);
    
                //     objectArray.push(objectData);
                // }
            });
        });

        console.log('objectArray:', objectArray)
        
        
        this.setState({ tableData: objectArray });

        this.clearSelects();        
        this.createTypeTable();
    }

    onClickDelete(element) {
        const { visit_type_id, school_type_id } = element.original;

        const arrayData = this.state.tableData;
        let arrayNewData = [];

        arrayData.map(item => {
            if(!(item.visit_type_id === visit_type_id && item.school_type_id === school_type_id)){
                arrayNewData.push(item);
            }
        });

        this.setState({ tableData: arrayNewData });
        this.createTypeTable();
    }

    handleChange(e) {
        const target = e.currentTarget;

        this.form.validateFields(target);

        this.setState({
            [target.name]: (target.type == 'checkbox') ? target.checked : target.value,
            submitButtonDisabled: !this.form.isValid()
        });
    }

    handleChangeSchoolType = (selectedOption) => {
        this.setState({ valid_select_school_type_id: 1, submitButtonDisabled: false });

        let schoolTypes = [];

        selectedOption.map(item => schoolTypes.push(item.value));

        const values = this.state;
        values.school_type_id = schoolTypes;
        this.setState({ values });
    }

    handleChangeVisitType = (selectedOption) => {
        this.setState({ valid_select_visit_type_id: 1, submitButtonDisabled: false });

        let visitTypes = [];

        selectedOption.map(item => visitTypes.push(item.value));

        const values = this.state;
        values.visit_type_id = visitTypes;
        this.setState({ values });
    }

    submitForm(event) {
        event.preventDefault();
        axios.post(`${apiPost}`, {
            'name': this.state.name,
            'active': true,
            'visit_type_school_type': this.state.tableData
        }).then(res => {
            this.setState({
                saved: true
            })
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error)[0].toString();
            this.setState({ back_error: data_error[filterId] });
        }.bind(this));
    }

    updateForm(event) {
        event.preventDefault();
        var id = this.props.match.params.id;

        axios.put(`${apiPost}/${id}`, {
            'name': this.state.name,
            'active': this.state.active,
            'visit_type_school_type': this.state.tableData
        }).then(res => {
            this.setState({
                saved: true
            })
        }).catch(function (error) {
            let data_error = error.response.data.errors;
            let filterId = Object.keys(data_error).toString();
            this.setState({ back_error: data_error[filterId] });
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        this.form.validateFields();

        this.setState({ submitButtonDisabled: !this.form.isValid() });        

        if (this.form.isValid()) {
            if (this.props.match.params.id !== undefined) {
                this.updateForm(event);
            } else {
                this.submitForm(event);
            }
        }
    }

    render() {
        let redirect = null;
        if (this.state.saved) {
            redirect = <Redirect to="/cadastro/acoes" />;
        }

        let statusField = null;
        if (this.props.match.params.id != undefined) {
            statusField =
                <div className="">
                    <div className="form-group form-inline">
                        <label className="" style={{ marginRight: "10px" }}>Status</label>
                        <div className="">
                            <Label className="switch switch-default switch-pill switch-primary">
                                <Input type="checkbox" id='active' name="active" className="switch-input" checked={this.state.active} onChange={this.handleChange} />
                                <span className="switch-label"></span>
                                <span className="switch-handle"></span>
                            </Label>
                        </div>
                    </div>
                </div>
        }

        return (
            <Card>
                {redirect}

                <CardBody>
                    {this.state.back_error !== '' &&
                        <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                    }
                    <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints} 
                        onSubmit={this.handleSubmit} noValidate>

                        <div className="">
                            <FormGroup for="name">
                                <FormControlLabel htmlFor="name">Nome da ação</FormControlLabel>
                                <FormControlInput type="text" id="name" name="name"
                                    value={this.state.name} onChange={this.handleChange}
                                    readOnly={this.state.viewMode}
                                    required />
                                <FieldFeedbacks for="name">
                                    <FieldFeedback when="*">Este campo é de preenchimento obrigatório</FieldFeedback>
                                </FieldFeedbacks>
                            </FormGroup>
                        </div>
                        <Row>
                            <Col xs="5" sm="5" md="5"> 
                            
                                <FormGroup for="user_id">
                                    <FormControlLabel htmlFor="visit_type_id">Tipo de Visita</FormControlLabel>
                                    <Select
                                        name="visit_type_id"
                                        id="visit_type_id"
                                        value={this.state.visit_type_id}
                                        onChange={this.handleChangeVisitType}
                                        options={this.state.visit_types}
                                        placeholder="Selecione..."
                                        disabled={this.state.viewMode}
                                        multi={true}
                                    />
                                    {this.state.valid_select_visit_type_id == 0 &&
                                        <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                    }
                                </FormGroup>  
                            </Col>
                            <Col xs="5" sm="5" md="5"> 
                                
                                <FormGroup for="subsidiary_id">
                                    <FormControlLabel htmlFor="school_type_id">Tipo de Escola</FormControlLabel>
                                    <Select
                                        name="school_type_id"
                                        id="school_type_id"
                                        value={this.state.school_type_id}
                                        onChange={this.handleChangeSchoolType}
                                        options={this.state.school_types}
                                        placeholder="Selecione..."
                                        disabled={this.state.viewMode}
                                        multi={true}
                                    />
                                    {this.state.valid_select_school_type_id == 0 &&
                                        <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                    }
                                </FormGroup>  
                            </Col>
                            <Col xs="2" sm="2" md="2"> 
                                
                                <FormGroup for="sector_id">
                                    <FormControlLabel htmlFor="sector_id"> </FormControlLabel>
                                    <Button onClick={this.validSelects} disabled={this.state.viewMode}>Adicionar</Button>
                                </FormGroup>  
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" md="12"> 
                                <ReactTable
                                    columns={this.state.columns}
                                    data={this.state.tableData}
                                    defaultPageSize={this.state.pageSize}
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

                        {statusField}

                        <button className="btn btn-primary" disabled={this.state.submitButtonDisabled}>Salvar</button>
                        <button className="btn btn-danger" onClick={this.props.history.goBack}>Cancelar</button>
                    </FormWithConstraints>

                </CardBody>
            </Card>
        )
    }
}

export default ActionForm;