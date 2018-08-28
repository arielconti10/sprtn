import React, { Component } from 'react';
import Select from 'react-select';
import { createTextMask } from 'redux-form-input-masks';
import { PropTypes } from 'prop-types'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap';
import ReactTable from 'react-table';

import { 
    changePhoneFlow, loadPhoneDataFlow, addPhoneFlow, updatePhoneFlow, deletePhoneFlow
} from '../../../actions/contact'

const validate = values => {
    const errors = {};

    return errors;
}

const phoneMask = createTextMask({
    pattern: '(99) 9999-9999',
    stripMask: false
});

const cellPhoneMask = createTextMask({
    pattern: '(99) 99999-9999',
    stripMask: false
});

// Our validation function for `name` field.
const fieldRequired = value => (value ? undefined : 'Este campo é de preenchimento obrigatório');

class PhoneForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        changePhoneFlow: PropTypes.func.isRequired,
        loadPhoneDataFlow: PropTypes.func.isRequired,
        addPhoneFlow: PropTypes.func.isRequired,
        updatePhoneFlow: PropTypes.func.isRequired,
        deletePhoneFlow: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            invalid_phone: false,
            invalid_phone_number: false,
            columns: []
        };

        this.handleChangePhone = this.handleChangePhone.bind(this);
        this.addPhone = this.addPhone.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
        this.renderEditableSelect = this.renderEditableSelect.bind(this);
        this.createPhoneTable = this.createPhoneTable.bind(this);
        this.onClickDeletePhone = this.onClickDeletePhone.bind(this);
    }

    handleChangePhone(selectOption) {
        this.props.changePhoneFlow(selectOption);
    }

    onClickDeletePhone(element) {
        const { phone_number } = element.value;
        const { phoneData } = this.props.contact;

        this.props.deletePhoneFlow(phoneData, phone_number);
    }

    createPhoneTable() {
        const columns = [
            {
                Header: "Ações", accessor: "", sortable: false, width: 90, headerClassName: 'text-left', Cell: (element) => (
                    !element.value.deleted_at ?
                        <div>
                            <button type="button" className='btn btn-danger btn-sm' onClick={() => this.onClickDeletePhone(element)}>
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
            },
            {
                Header: "Tipo",
                id: "phone_type",
                width: 380,
                accessor: (element) => {
                    return (<select name="phone_type" className="form-control" id={element.id} value={element.phone_type} onChange={this.renderEditableSelect}>
                        <option value="home">Casa</option>
                        <option value="mobile">Celular</option>
                        <option value="fax">Fax</option>
                        <option value="work">Trabalho</option>
                    </select>)
                }
            },
            { 
                Header: "Telefone", 
                id: "phone_number",
                headerClassName: 'text-left',
                accessor: "phone_number",
                Cell: this.renderEditable 
            },
            { 
                Header: "Observaçāo", 
                id: 'phone_extension',
                accessor: "phone_extension", 
                headerClassName: 'text-left',
                Cell: this.renderEditable 
            },
        ];

        this.setState({columns});
    }

    addPhone() {
        const { phone_number, phone_extension } = this.props;
        const { phoneTypeId, phoneData } = this.props.contact;
        const phone_type = phoneTypeId.value;
        
        const phoneObject = {
            phone_number,
            phone_extension,
            phone_type
        }

        this.setState( { invalid_phone : false });
        this.setState( { invalid_phone_number: false });

        if (!phone_type) {
            this.setState({ invalid_phone : true });
        }

        if (!phone_number) {
            this.setState({ invalid_phone_number : true });
        }

        if (!this.state.invalid_phone && !this.state.invalid_phone_number) {
            this.createPhoneTable();
            this.props.addPhoneFlow(phoneObject, phoneData);
        }

        this.props.reset();
    }


    renderEditable(cellInfo) {
        try {
            let index = cellInfo.index;
            let column_id = cellInfo.column.id;
            return (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = this.props.contact.phoneData;
                                        
                    data[index]['from_editable'] = 1;
                    data[index][column_id] = e.target.innerHTML;

                    this.props.updatePhoneFlow(data);     
                }}
                dangerouslySetInnerHTML={{
                  __html: this.props.contact.phoneData[index][column_id]
                }}
              />
            );
        } catch (error) {
            console.log(error);
        }
    }

    renderEditableSelect(cellInfo) {
        try {
            let phoneData = this.props.contact.phoneData;

            let index = phoneData.findIndex(function(item){
                return cellInfo.target.id == item.id;
            });
            let column_id = cellInfo.target.name;

            phoneData[index][column_id] = cellInfo.target.value;
            phoneData[index]['from_editable'] = 1;

            this.props.updatePhoneFlow(phoneData);

            this.createPhoneTable();
        } catch (error) {
            console.log(error);
        }
    }

    renderSelectInput = ({ input, name, valueOption, options, labelKey, valueKey, onChangeFunction ,meta: { touched, error } }) => (
        <div className="form-group group-select">
            <Select
                {...input}
                name={name}
                id={name}
                // disabled={this.state.viewMode}
                value={valueOption}
                onChange={onChangeFunction}
                options={options}
                placeholder="Selecione..."
                labelKey={labelKey}
                valueKey={valueKey}
                onBlur={() => input.onBlur(input.value)}
            />

            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    renderNameInput = ({ input, type, disabled, valueOption ,meta: { touched, error } }) => (
        <div>
            {/* Spread RF's input properties onto our input */}
            <input
                className="form-control"
                {...input}
                type={type}
                disabled={disabled}
                // value={valueOption}
            />
            {touched && error && (
                <div style={{ color: 'red'}}>
                    {error}
                </div>
            )
            }
        </div>
    )

    componentWillReceiveProps(nextProps) {

        if (this.props.phonesData !== nextProps.phonesData) {
            const phones = nextProps.phonesData;
            this.createPhoneTable();
            this.props.loadPhoneDataFlow(phones);
        }
    }

    render() {
        const { phoneTypeId, phoneData } = this.props.contact;

        const {
            phone_number
        } = this.props

        const {
            handleSubmit,
        } = this.props;

        return (
            <fieldset>
                <legend>Telefones</legend>
                <div className="row">
                    <div className="col-md-4">
                        <label>Tipo de telefone</label>
                        <Field
                            name="phone_type"
                            options={[
                                {label: 'Casa', value: 'home'},
                                {label: 'Celular', value: 'mobile'},
                                {label: 'Fax', value: 'fax'},
                                {label: 'Trabalho', value: 'work'}
                            ]}
                            onChangeFunction={this.handleChangePhone}
                            placeholder="Selecione..."
                            valueOption={phoneTypeId}
                            component={this.renderSelectInput}
                        />
                        { this.state.invalid_phone && 
                            <div style={{ color: 'red'}}>Este campo é de preenchimento obrigatório</div>
                        }
                        <br />
                        <button type="button" className="btn btn-primary" onClick={this.addPhone}>Adicionar Telefone</button>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="phone_number">
                                Telefone
                            </label>
                            <Field
                                name="phone_number"
                                id="phone_number"
                                component={this.renderNameInput}
                                placeholder="Telefone"
                                validate={fieldRequired}
                                {...phoneTypeId.value !== "mobile"?phoneMask:cellPhoneMask}
                            />
                            { this.state.invalid_phone_number && 
                                <div style={{ color: 'red'}}>Este campo é de preenchimento obrigatório</div>
                            }

                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="phone_extension">
                                Observaçāo
                            </label>
                            <Field
                                name="phone_extension"
                                id="phone_extension"
                                component={this.renderNameInput}
                                placeholder="Observaçāo"
                            />
                        </div>
                    </div>
                </div>
                <br />

                <Row>
                    <Col md="12">
                        <ReactTable
                            columns={this.state.columns}
                            data={phoneData}
                            // loading={loading}
                            defaultPageSize={5}
                            loadingText='Carregando...'
                            noDataText='Sem registros'
                            ofText='de'
                            rowsText=''
                            className='-striped -highlight'
                        />
                    </Col>
                </Row>
            </fieldset>
        )
    }
}

const functions_object = {
    changePhoneFlow,
    loadPhoneDataFlow,
    addPhoneFlow,
    updatePhoneFlow,
    deletePhoneFlow
};

// Decorate with redux-form
let SelectingFormValuesForm = reduxForm({
    form: 'selectingFormValues' // a unique identifier for this form
})(PhoneForm)
  
// Decorate with connect to read form values
const selector = formValueSelector('selectingFormValues') // <-- same as form name
    SelectingFormValuesForm = connect(state => {

    // can select values individually
    const phone_number = selector(state, 'phone_number');
    const phone_extension = selector(state, 'phone_extension');
    return {
        phone_number,
        phone_extension,
        contact : state.contact,
        user: state.user
    }
}, functions_object)(SelectingFormValuesForm)
  
export default SelectingFormValuesForm