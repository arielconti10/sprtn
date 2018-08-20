import React, { Component } from 'react';
import {Row, Col } from 'reactstrap';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUserSchool, changeUserFlow, changeSubsidiarySchoolFlow, changeSectorFlow, changeSchoolType,
    selectOptionSchoolFlow, selectWalletOption, selectSchoolFlow, removeWalletOptionFlow
} from '../../../actions/userSchool'

import { FormWithConstraints } from 'react-form-with-constraints';
import { FormGroup, FormControlLabel } from 'react-form-with-constraints-bootstrap4';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import FilteredMultiSelect from 'react-filtered-multiselect';

import axios from '../../../app/common/axios';
import { verifyToken } from '../../../app/common/AuthorizeHelper';
import '../../custom.css';

import { canUser } from '../../common/Permissions';

const BOOTSTRAP_CLASSES = {
    filter: 'form-control',
    select: 'form-control',
    button: 'btn btn btn-block btn-default',
    buttonActive: 'btn btn btn-block btn-primary',
}

class UserSchools extends Component {   
    // Pass the correct proptypes in for validation
    static propTypes = {
        loadUserSchool: PropTypes.func,
        changeUserFlow: PropTypes.func,
        changeSubsidiarySchoolFlow: PropTypes.func,
        changeSectorFlow: PropTypes.func,
        selectOptionSchoolFlow: PropTypes.func,
        selectWalletOption: PropTypes.func,
        removeWalletOptionFlow: PropTypes.func,
        marketshare: PropTypes.shape({
            schools: PropTypes.array,
            back_error: PropTypes.string,
            user_id: PropTypes.integer,
            sectors: PropTypes.array,
            school_types: PropTypes.array,
            school_type_id: PropTypes.array,
            ringLoad: PropTypes.bool
        }),
    }

    constructor() {
        super();
    }

    componentDidMount() {
        this.countTotalSelected();
        this.countTotalWallet();
    }

    componentWillMount() {
        this.checkPermission();
        canUser('user-schools.view', this.props.history, "view");
        this.props.loadUserSchool();
    }

    checkPermission() {
        canUser('user-school.register', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));
    }

    handleChangeUser = (selectedOption) => {
        this.props.changeUserFlow(selectedOption.id);
    }

    handleChangeSubsidiary = (selectedOption) => {
        console.log("change subsdiary flow", selectedOption.id, selectedOption.sectors);
        this.props.changeSubsidiarySchoolFlow(selectedOption.id, selectedOption.sectors);
    }

    handleChangeSector = (selectedOption) => {
        const user_school = this.props.userSchool;
        const sector_id = selectedOption.id;
        const subsidiary_id = user_school.subsidiary_id;
        const school_type_id = user_school.school_type_id;
        const schools = user_school.schools;
        const schools_wallet = user_school.wallet_schools;
        
        this.props.changeSectorFlow(sector_id, subsidiary_id, school_type_id, schools, schools_wallet);
    }

    handleChangeSchoolType = (selectedOption) => {
        const user_school = this.props.userSchool;
        const sector_id = user_school.sector_id;
        const subsidiary_id = user_school.subsidiary_id;
        const school_type_id = selectedOption;
        const schools = user_school.schools;
        const schools_wallet = user_school.wallet_schools;
        
        this.props.changeSchoolType(selectedOption);
        this.props.changeSectorFlow(sector_id, subsidiary_id, school_type_id, schools, schools_wallet);
    }

    handleSelect = (selectedOptions) => {
        const userSchool = this.props.userSchool;
        const user_id = userSchool.user_id;
        const available_options = selectedOptions;
        const schools = userSchool.schools;
        const schools_wallet = userSchool.wallet_schools;

        this.props.selectSchoolFlow(user_id, available_options, schools, schools_wallet);
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

            this.props.selectOptionSchoolFlow(total);
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

            this.props.selectWalletOption(total);
        }.bind(this));
    }

    showSelected() {
        const userSchool = this.props.userSchool;
        const total_selected_available = userSchool.total_selected_available;

        if (total_selected_available && total_selected_available > 0) {
            return <span>/ {total_selected_available} Selecionadas(s)</span> 
        }

        return "";
    }

    showWalletSelected() {
        const userSchool = this.props.userSchool;
        const total_selected_wallet = userSchool.total_selected_wallet;

        if (total_selected_wallet && total_selected_wallet > 0) {
            return <span>/ {total_selected_wallet} Selecionadas(s)</span>;
        } else {
            return "";
        }
            
    }

    handleDeselect = (deselectedOptions) => {
        const userSchool = this.props.userSchool;
        const deselected_options = deselectedOptions;
        const wallet_schools = userSchool.wallet_schools;
        const user_id = userSchool.user_id;
        const schools = userSchool.schools;

        this.props.removeWalletOptionFlow(deselected_options, wallet_schools, user_id, schools);
    }

    render() {
        const { users, back_error, user_id, subsidiaries, subsidiary_id, sectors, sector_id,
            school_types, school_type_id, schools, ringLoad, wallet_schools
        } = this.props.userSchool;

        return (
        <div>
            {ringLoad == true &&
                <div className="loader">
                    <div className="backLoading">
                        <div className="load"></div>
                    </div>
                </div>
            }
            { back_error && <h4 className="alert alert-danger"> {back_error} </h4> }
            <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints} noValidate>   
                <Row>
                    <Col xs="6" sm="6" md="6"> 
                        <FormGroup for="user_id">
                            <FormControlLabel htmlFor="user_id">Consultor</FormControlLabel>
                            <Select
                                name="user_id"
                                onChange={(selectedOption) => {this.handleChangeUser(selectedOption)}}
                                labelKey="concat_field"
                                valueKey="id"
                                value={user_id}
                                placeholder="Selecione o consultor"
                                multi={false}
                                options={users}
                            />
                            {(schools && schools.length > 0 && !user_id)  &&
                                <div className="form-control-feedback"><div className="error">Este campo é de preenchimento obrigatório</div></div>
                            }
                        </FormGroup>  
                    </Col>

                    <Col xs="3" sm="3" md="3"> 
                        <FormGroup for="subsidiary_id">
                            <FormControlLabel htmlFor="subsidiary_id">Filial</FormControlLabel>
                            <Select
                                name="subsidiary_id"
                                onChange={(selectedOption) => {this.handleChangeSubsidiary(selectedOption)}}
                                labelKey="code_name"
                                valueKey="id"
                                value={subsidiary_id}
                                multi={false}
                                placeholder="Selecione a filial"
                                options={subsidiaries}
                            />
                        </FormGroup>  
                    </Col>

                    <Col xs="3" sm="3" md="3"> 
                            
                            <FormGroup for="sector_id">
                                <FormControlLabel htmlFor="sector_id">Setor</FormControlLabel>
                                <Select
                                    name="sector_id"
                                    onChange={(selectedOption) => {this.handleChangeSector(selectedOption)}}
                                    labelKey="name"
                                    valueKey="id"
                                    value={sector_id}
                                    multi={false}
                                    placeholder="Selecione o setor"
                                    options={sectors}
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
                                onChange={(selectedOption) => {this.handleChangeSchoolType(selectedOption)}}
                                labelKey="name"
                                valueKey="id"
                                value={school_type_id}
                                multi={true}
                                joinValues={false}
                                placeholder="Selecione o tipo de escola"
                                options={school_types}
                            />
                        </FormGroup>  
                    </Col>
                </Row>

                <Row>
                    <Col md="6">   
                        <div className="escolas-disponiveis"> 
                            <FormGroup for="role_id">
                                <FormControlLabel htmlFor="role_id" className="label-carteira">
                                    <i className="fa fa-building-o"></i> <strong>{schools?schools.length:'0'}</strong> Escolas Disponíveis
                                    {this.showSelected()}
                                </FormControlLabel>
                                    <FilteredMultiSelect
                                        placeholder='digite para filtrar'
                                        buttonText="Adicionar"
                                        classNames={BOOTSTRAP_CLASSES}
                                        onChange={this.handleSelect}
                                        options={schools?schools:[]}
                                        // selectedOptions={selectedOptions}
                                        textProp="label"
                                        valueProp="id"
                                        // disabled={this.state.viewMode}
                                        size={15}
                                    />
                            </FormGroup>
                        </div>
                    </Col>

                    <Col md="6">
                        <div className="escolas-carteira"> 
                            <FormGroup for="role_id">
                                <FormControlLabel htmlFor="role_id" className="label-carteira">
                                    <i className="fa fa-suitcase"></i> <strong>{wallet_schools?wallet_schools.length:'0'}</strong> Escolas na Carteira
                                    {this.showWalletSelected()}
                                </FormControlLabel>
                                    <FilteredMultiSelect
                                        placeholder='digite para filtrar'
                                        buttonText="Remover"
                                        classNames={BOOTSTRAP_CLASSES}
                                        // disabled={this.state.viewMode}
                                        onChange={this.handleDeselect}
                                        options={wallet_schools?wallet_schools:[]}
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

const mapStateToProps =(state) => ({
    userSchool : state.userSchool
});

const functions_object = {
    loadUserSchool, changeUserFlow, changeSubsidiarySchoolFlow, changeSectorFlow, changeSchoolType, selectOptionSchoolFlow,
    selectWalletOption, selectSchoolFlow, removeWalletOptionFlow
}

export default connect(mapStateToProps, functions_object )(UserSchools);