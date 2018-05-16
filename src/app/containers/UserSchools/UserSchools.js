import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

import FilteredMultiSelect from 'react-filtered-multiselect';

import axios from '../../../app/common/axios';
import { verifyToken } from '../../../app/common/AuthorizeHelper';
import { RingLoader } from 'react-spinners';
import '../../custom.css';

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
    { stateArray: 'users', fieldLabel:'concat_field', name: 'user_id', api: 'hierarchy/childrens', 
        labelConcat: ['username', 'name', 'email']
    }
];

class UserSchools extends Component {   

    constructor() {
        super();
        this.state = {
            ringLoad: false,
            selectedOptions: [],
            school_types: [],
            school_type_id: 0,
            sectors: [],
            sector_id: 0,
            subsidiaries: [],
            subsidiary_id: 0,
            users: [],
            user_id: 0,
            schools: [],
            total_available: 0,
            total_selected_available: 0,
            total_selected_wallet: 0,
            back_error: ''
        };
    }

    /**
     * concatena campos de um Array
     * por exemplo: login de rede e e-mail de um usuário
     * @param Array data array de objetos 
     * @param Array to_concat array unidimensional com os dados a serem concatenados
     * @return Array final_array lista com os dados concatenados 
     */
    concatenateArray(data, to_concat) {
        let final_array = data;
        let concat_size = to_concat.length;
        final_array.map(item => {
            let concat = '';
            let concat_array_total = 0;
            to_concat.map(label_concat => {
                concat = concat + ' – ' + item[label_concat];
                concat_array_total++;
                if (concat_size == concat_array_total) {
                    item.concat_field = concat;
                    // console.log(concat);
                }               
            })
            item.concat_field = item.concat_field.trim();
            item.concat_field = item.concat_field.substring(1).trim();
            // item.concat_field = item.concat_field + ")";
        });

        return final_array;
    }

    /**
     * realiza a busca de acordo com a listagem de apis, informado nas constantes
     * o objetivo é de, por exemplo, preencher selectbox na aplicaçāo
     */
    searchByApi() {
        apis.map(item => {
            axios.get(`${item.api}`)
                .then(response => {
                    let dados = response.data.data;
                    if (item.labelConcat !== undefined && item.labelConcat.length > 0) {
                        dados = this.concatenateArray(dados, item.labelConcat);
                    }
                    this.setState({ [item.stateArray]: dados });
                })
                .catch(error => verifyToken(error.response.status));
        });
    }

    /**
     * com base em uma lista, gera o texto completo da escola
     * por exemplo: Filial - Setor - Tipo de escola - Codigo TOTVS - Nome da escola
     * @param Array list lista de escolas
     * @return Array new_list lista com os nomes concatenados
     */
    getTextSchool(list) {
        let new_list = list;
        new_list.map(item => {
            if (item.school_type !== undefined || item.school_type !== null) {
                item.id = `${item.id} | ${item.school_type.name}`;
                item.label = `${item.subsidiary.name} - ${item.sector.name} - ${item.school_type.name} - ${item.school_code_totvs} - ${item.name}`;
            } else {
                item.label = `${item.subsidiary.name} - ${item.sector.name} - ${item.school_code_totvs} - ${item.name}`;
            }
        });

        return new_list;
    }

    verifyRingLoader() {
        let actual_state = this.state.ringLoad;
        this.setState({ringLoad : !actual_state});
    }

    /**
     * retorna os IDs de uma seleçāo de dados
     * funçāo chamada para arrays separados com id | valor
     * @param Array results lista com os resultados encontrados
     * @return Array arrays_id lista com os IDs
     */
    verifyOptionsId(results) {
        let array_ids = [];
        results.map(item => {
            let item_split = item.id.toString().split("|");
            let id = item_split[0].trim();
            array_ids.push(id);
        });

        return array_ids;
    }

    componentDidMount() {
        this.searchByApi();
    }

    /**
     * com base na lista de escolas na carteira, retorna as escolas disponíveis
     * ou seja, as escolas disponíveis nāo terá escolas que estāo nas carteiras
     * @param {Array} selectedOptions opções selecionadas 
     * @return {Array} filtered escolas que estāo apenas na aba de disponíveis
     */
    filterAvailableSchools(selectedOptions) {
        let selected_ids = selectedOptions.map(a => a.school_code_totvs);

        let filtered = this.state.schools.filter(function(value) {
            let value_id = value.school_code_totvs;
            return selected_ids.indexOf(value_id) == -1;
        });   

        let total_available = filtered.length;

        this.setState({schools: filtered, total_available ,selectedOptions, ringLoad: false});
    }

    handleSelect = (selectedOptions) => {

        this.setState({ringLoad: true, back_error:''});

        if (this.state.user_id == 0) {
            this.setState({ringLoad:false});
            return false;
        }
        selectedOptions.sort((a, b) => a.id - b.id);

        let array_ids = this.verifyOptionsId(selectedOptions);

        axios.post('user-school', {
            'user_id': this.state.user_id,
            'school_id': array_ids,
            'type': 'insert'
        })
        .then(response => {
            this.filterAvailableSchools(selectedOptions);
            this.setState({total_selected_available:0});
        })
        .catch(function(error) {
            /*
            para todos os outros erros, é retornado mensagem de erro com código
            para estouro de memória, retorna apenas a mensagem "Error: Network Error"
            condicao para tratar a mensagem
            */
            let error_message = error.toString();
            if (error == "Error: Network Error") {
                error_message = "Error 500 - Allowed memory size exhausted";
            }
            this.setState({ringLoad: false, back_error: error_message, total_selected_available: 0});
        }.bind(this));        
    }

    handleDeselect = (deselectedOptions) => {

        this.setState({ringLoad : true});

        if (this.state.user_id == 0) {
            //validação de obrigatoriedade do campo de usuário
            return false;
        }

        var selectedOptions = this.state.selectedOptions.slice()
        deselectedOptions.forEach(option => {
          selectedOptions.splice(selectedOptions.indexOf(option), 1)
        })

        let array_ids = this.verifyOptionsId(selectedOptions);

        axios.post('user-school', {
            'user_id': this.state.user_id,
            'school_id': array_ids,
            'type': 'insert'
        })
        .then(response => {
            
            this.setState({selectedOptions, ringLoad: false, total_selected_wallet: 0}, function() {
                const total_available = this.state.schools.length - this.state.selectedOptions.length;
                this.setState({total_available});
            });
        })
        .catch(function(error) {
            /*
            para todos os outros erros, é retornado mensagem de erro com código
            para estouro de memória, retorna apenas a mensagem "Error: Network Error"
            condicao para tratar a mensagem
            */
            let error_message = error.toString();
            if (error == "Error: Network Error") {
                error_message = "Error 500 - Allowed memory size exhausted";
            }
            this.setState({ringLoad: false, back_error: error_message, total_selected_wallet: 0});
        }.bind(this)); 
    }

    handleSelectChange = (field, value, func, obj) => {

        const values = this.state;
        if (typeof value == 'object') {
            values[field] = value.map(function(item) {
                return item.id;
            });
        }
        else {
            values[field] = value;
        }

        // this.setState({ringLoad : true});

        // this.verifyRingLoader();
        
        func(obj);

    }

    getSectors = (obj) => {
        this.setState({ringLoad: true});
        this.setState({sectors: obj.sectors, ringLoad: false});
    }

    getUserSchool = (obj) => {
        this.setState({ringLoad:true});

        this.countTotalWallet();

        axios.get('user-school/' + obj.id)
                .then(response => {
                    let dados = response.data.data;
                    dados = this.getTextSchool(dados);                    
                    this.setState({selectedOptions: dados, ringLoad: false});
                })
                .catch(err => console.log(err));   
    }

    /**
     * a funçāo utiliza elementos de seleçāo javascript devido ao componente FilterSelectMultiple nāo fornecer
     * evento de elementos selecionados (antes do click em 'Adicionar' ou 'Remover')
     */
    countTotalSelected() {
        document.addEventListener('change', function(){
            let options = document.querySelectorAll('.escolas-disponiveis option');
            let total = 0;

            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    total++;
                }
            }

            this.setState({total_selected_available : total});
        }.bind(this));
    }

    countTotalWallet() {

        document.addEventListener('change', function(){
            let options = document.querySelectorAll('.escolas-carteira option');
            let total = 0;

            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    total++;
                }
            }

            this.setState({total_selected_wallet : total});
        }.bind(this));
    }

    getSchools = () => {
        //contagem de escolas selecionadas
        // this.countTotalSelected();

        this.setState({schools: [], ringLoad: true});

        let filters = "&filter[active]=1";
        filters += "&filter[portfolio]=1";
        if (this.state.sector_id == 0 && this.state.school_type_id == 0) {
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
                    dados = this.getTextSchool(dados); 
                    
                    this.setState({ schools: dados, ringLoad: false, total_selected_available: 0}, function() {
                        this.countTotalSelected();
                        this.filterAvailableSchools(this.state.selectedOptions);
                        // const total_available = this.state.schools.length - this.state.selectedOptions.length;
                        // this.setState({total_available});
                    });
                })
                .catch(err => console.log(err));

    }

    render() {

        var { selectedOptions, total_available } = this.state;
    
        return (
            
            <div>
                {this.state.ringLoad == true &&
                    <div className="loader">
                        <div className="backLoading">
                            <div className="load"></div>
                        </div>
                    </div>
                }

                {this.state.back_error !== '' &&
                    <h4 className="alert alert-danger"> {this.state.back_error} </h4>
                }

                <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                                noValidate>                
                {/* <RingLoader
                    color={'#123abc'}
                    loading={this.state.ringLoad}
                    margin='50px'
                />         */}
                    <Row>
                        <Col xs="6" sm="6" md="6"> 
                        
                            <FormGroup for="user_id">
                                <FormControlLabel htmlFor="user_id">Consultor</FormControlLabel>
                                <Select
                                    name="user_id"
                                    onChange={(selectedOption) => {this.handleSelectChange('user_id', selectedOption.id, this.getUserSchool, selectedOption);}}
                                    labelKey="concat_field"
                                    valueKey="id"
                                    value={this.state.user_id}
                                    placeholder="Selecione o consultor"
                                    multi={false}
                                    options={this.state.users}
                                />
                                {(this.state.schools.length > 0 && this.state.user_id == "")  &&
                                    <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                                }
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
                                
                            <div className="escolas-disponiveis"> 
                                <FormGroup for="role_id">
                                    <FormControlLabel htmlFor="role_id" className="label-carteira">
                                        <i className="fa fa-building-o"></i> <strong>{total_available > 0?total_available:'0'}</strong> Escolas Disponíveis
                                        {(this.state.total_selected_available > 0)  &&
                                            <span>/ {this.state.total_selected_available} Selecionadas(s)</span> 
                                        }
                                    </FormControlLabel>
                                        <FilteredMultiSelect
                                            placeholder='digite para filtrar'
                                            buttonText="Adicionar"
                                            classNames={BOOTSTRAP_CLASSES}
                                            onChange={this.handleSelect}
                                            options={this.state.schools}
                                            selectedOptions={selectedOptions}
                                            textProp="label"
                                            valueProp="id"
                                            size={15}
                                        />
                                </FormGroup>
                            </div>
                        </Col>
                       
                        <Col md="6">
                        <div className="escolas-carteira"> 
                            <FormGroup for="role_id">
                                <FormControlLabel htmlFor="role_id" className="label-carteira">
                                    <i className="fa fa-suitcase"></i> <strong>{selectedOptions.length}</strong> Escolas na Carteira
                                    {(this.state.total_selected_wallet > 0)  &&
                                            <span>/ {this.state.total_selected_wallet} Selecionadas(s)</span> 
                                    }
                                </FormControlLabel>
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
                                        textProp="label"
                                        valueProp="id"
                                        size={15}
                                    />
                            </FormGroup>
                        </div>
                        </Col>
                    </Row>
                </FormWithConstraints>
            </div>
        )
    }
}

export default UserSchools;