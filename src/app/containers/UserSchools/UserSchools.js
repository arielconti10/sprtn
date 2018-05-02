import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

import FilteredMultiSelect from 'react-filtered-multiselect';

import axios from '../../../app/common/axios';

const BOOTSTRAP_CLASSES = {
    filter: 'form-control',
    select: 'form-control',
    button: 'btn btn btn-block btn-default',
    buttonActive: 'btn btn btn-block btn-primary',
}

const apis = [
    { stateArray: 'school_types', fieldLabel:'name', name: 'school_type_id', api: 'school-type' },
    //{ stateArray: 'sectors', fieldLabel:'name', name: 'sector_id', api: 'sector' },
    { stateArray: 'subsidiaries', fieldLabel:'name', name: 'subsidiary_id', api: 'subsidiary' },
    { stateArray: 'users', fieldLabel:'full_name', name: 'user_id', api: 'hierarchy/childrens' }
];

class UserSchools extends Component {   

    state = {
        selectedOptions: [],
        school_types: [],
        school_type_id: 0,
        sectors: [],
        sector_id: 0,
        subsidiaries: [],
        subsidiary_id: 0,
        users: [],
        user_id: 0,
        schools: []
    }

    componentDidMount() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
                    
                    // dados.map(data => (item) => {
                    //     data['value'] = data.id,
                    //     data['label'] = data[item.fieldName]
                    // });
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(err => console.log(err));
        });
    }
    
    handleSelect = (selectedOptions) => {

        console.log(selectedOptions);
        if (this.state.user_id == 0) {
            //validação de obrigatorio do campo de usuário
            return false;
        }
        selectedOptions.sort((a, b) => a.id - b.id);

        axios.post('user-school', {
            'user_id': this.state.user_id,
            'school_id': selectedOptions.map(item => item.id)
        })
        .then(response => {
            this.setState({selectedOptions})
        })
        .catch(err => console.log(err));
        

        //console.log(this.state.user_id);
    }

    handleDeselect = (deselectedOptions) => {

        if (this.state.user_id == 0) {
            //validação de obrigatoriedade do campo de usuário
            return false;
        }

        var selectedOptions = this.state.selectedOptions.slice()
        deselectedOptions.forEach(option => {
          selectedOptions.splice(selectedOptions.indexOf(option), 1)
        })

        axios.delete('user-school', {
            params: {
                'user_id': this.state.user_id,
                'school_id': deselectedOptions.map(item => item.id)
            }           
        })
        .then(response => {           

            this.setState({selectedOptions})
        })
    }

    handleSelectChange = (field, value, func, obj) => {

        //console.log(typeof value);

        const values = this.state;
        if (typeof value == 'object') {
            values[field] = value.map(function(item) {
                return item.id;
            });
        }
        else {
            values[field] = value;
        }
        
        this.setState({ values });

        func(obj);
    }

    getSectors = (obj) => {
        //console.log(obj.sectors);
        this.setState({sectors: obj.sectors});
    }

    getUserSchool = (obj) => {

        axios.get('user-school/' + obj.id)
                .then(response => {
                    let dados = response.data.data;

                    console.log(dados);
                    this.setState({selectedOptions: dados})
                    //console.log(Object.keys(dados).length);
                    // dados.map(data => (item) => {
                    //     data['value'] = data.id,
                    //     data['label'] = data[item.fieldName]
                    // });
                    //this.setState({ schools: dados });
                })
                .catch(err => console.log(err));

        // const role_id = selectedOption.map(function(item) {
        //     return item.id;
        // });

        // this.setState({ role_id: role_id });
    }

    getSchools = () => {

        //console.log(this.state);

        this.setState({schools: []});

        let filters = "&filter[active]=0";
        if (this.state.sector_id == 0 && this.state.school_type_id == 0) {
            //this.setState({schools: []});
            return false;
        }

        if (this.state.sector_id != 0) {            
            filters += "&filter[sector_id]=" + this.state.sector_id;
        }

        if (this.state.subsidiary_id != 0) {            
            filters += "&filter[subsidiary_id]=" + this.state.subsidiary_id;
        }

        if (this.state.school_type_id != 0) {

                filters += "&filter[school_type_id][]=" + this.state.school_type_id.join("&filter[school_type_id][]=");
        }

        axios.get('user-schools?' + filters)
                .then(response => {
                    let dados = response.data.data;
                    //console.log(Object.keys(dados).length);
                    // dados.map(data => (item) => {
                    //     data['value'] = data.id,
                    //     data['label'] = data[item.fieldName]
                    // });
                    this.setState({ schools: dados });
                })
                .catch(err => console.log(err));

        // const role_id = selectedOption.map(function(item) {
        //     return item.id;
        // });

        // this.setState({ role_id: role_id });
    }

    render() {

        var {selectedOptions} = this.state

        return (
            <div>
                <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                                noValidate>                        
                    <Row>
                        <Col xs="6" sm="6" md="6"> 
                        
                            <FormGroup for="user_id">
                                <FormControlLabel htmlFor="user_id">Consultor</FormControlLabel>
                                <Select
                                    name="user_id"
                                    onChange={(selectedOption) => {this.handleSelectChange('user_id', selectedOption.id, this.getUserSchool, selectedOption);}}
                                    labelKey="full_name"
                                    valueKey="id"
                                    value={this.state.user_id}
                                    placeholder="Selecione o consultor"
                                    multi={false}
                                    options={this.state.users}
                                />
                            </FormGroup>  
                        </Col>
                        <Col xs="3" sm="3" md="3"> 
                            
                            <FormGroup for="subsidiary_id">
                                <FormControlLabel htmlFor="subsidiary_id">Filial</FormControlLabel>
                                <Select
                                    name="subsidiary_id"
                                    onChange={(selectedOption) => {this.handleSelectChange('subsidiary_id', selectedOption.id, this.getSectors, selectedOption);}}
                                    labelKey="code_name"
                                    valueKey="id"
                                    value={this.state.subsidiary_id}
                                    multi={false}
                                    placeholder="Selecione a filial"
                                    options={this.state.subsidiaries}
                                />
                            </FormGroup>  
                        </Col>
                        <Col xs="3" sm="3" md="3"> 
                            
                            <FormGroup for="sector_id">
                                <FormControlLabel htmlFor="sector_id">Setor</FormControlLabel>
                                <Select
                                    name="sector_id"
                                    onChange={(selectedOption) => {this.handleSelectChange('sector_id', selectedOption.id, this.getSchools);}}
                                    labelKey="name"
                                    valueKey="id"
                                    value={this.state.sector_id}
                                    multi={false}
                                    placeholder="Selecione o setor"
                                    options={this.state.sectors}
                                />
                            </FormGroup>  
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md="12">                             
                            <FormGroup for="school_type_id">
                                <FormControlLabel htmlFor="school_type_id">Tipo de escola</FormControlLabel>
                                <Select
                                    name="school_type_id"
                                    onChange={(selectedOption) => {this.handleSelectChange('school_type_id', selectedOption, this.getSchools);}}
                                    // onChange={(selectedOption) => { this.setState({ school_type_id: selectedOption.map(function(item) {
                                    //     return item.id;
                                    // }) })}
                                    labelKey="name"
                                    valueKey="id"
                                    value={this.state.school_type_id}
                                    multi={true}
                                    joinValues={false}
                                    placeholder="Selecione o tipo de escola"
                                    options={this.state.school_types}
                                />
                            </FormGroup>  
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup for="role_id">
                                <FormControlLabel htmlFor="role_id">Escolas Disponíveis</FormControlLabel>
                                    <FilteredMultiSelect
                                        placeholder='digite para filtrar'
                                        buttonText="Adicionar"
                                        classNames={BOOTSTRAP_CLASSES}
                                        onChange={this.handleSelect}
                                        options={this.state.schools}
                                        selectedOptions={selectedOptions}
                                        textProp="name"
                                        valueProp="id"
                                        size={15}
                                    />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                        <FormGroup for="role_id">
                            <FormControlLabel htmlFor="role_id">Escolas na Carteira</FormControlLabel>
                                <FilteredMultiSelect
                                    placeholder='digite para filtrar'
                                    buttonText="Remover"
                                    classNames={{
                                        filter: 'form-control',
                                        select: 'form-control',
                                        button: 'btn btn btn-block btn-default',
                                        buttonActive: 'btn btn btn-block btn-danger'
                                    }}
                                    onChange={this.handleDeselect}
                                    options={selectedOptions}
                                    textProp="name"
                                    valueProp="id"
                                    size={15}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </FormWithConstraints>
            </div>
        )
    }
}

export default UserSchools;