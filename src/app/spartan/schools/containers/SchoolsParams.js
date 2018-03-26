import './SchoolsStyle.css'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import IonSlider from '../../../template/components/forms/inputs/IonSlider'
import { nameSearch, stateSearch, citySearch, studentsSearch } from './SchoolsActions'

class SchoolsParams extends Component {
    componentWillMount() {
       // this.props.getList()
    }
    render() {
        return (
            <div id="content">
                <form className="smart-form">
                    <div className="row">
                        <section className="col col-9 input-school-search">
                            <label className="input"> <i className="icon-append fa fa-search" />
                                <input type="text" name="schoolSearch" placeholder="Escola" onChange={``} />
                            </label>
                        </section>
                        <section className="col col-3 input-school-state">
                            <label className="select">
                                <select name="schoolState" onChange={``}>
                                    <option value="">UF</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="TO">Tocantins</option>
                                </select> <i /> </label>
                        </section>
                        <section className="col col-4 input-school-city">
                            <label className="input">
                                <input type="text" name="schoolCity" placeholder="Cidade" onChange={``} />
                            </label>
                        </section>
                        <section className="col col-8">
                            <div className="form-group">
                                <IonSlider type="text" data-min="1" data-max="999999"
                                    data-type="double" data-step="10" data-postfix=""
                                    data-from="1" data-to="999999"
                                    data-hasgrid="true" onChange={``} />
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ nameSearch, stateSearch, citySearch, studentsSearch }, dispatch)
export default connect(null, mapDispatchToProps)(SchoolsParams)