import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Button, ButtonGroup, Input } from 'reactstrap'
import {levelLoad} from '../../../actions/level'
import { select } from 'redux-saga/effects';
class SchoolDisciplineList extends Component {
 
constructor(props) {
    super(props)
    this.state = { cSelected: [], disciplines: [], grades:[] };

    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  onCheckboxBtnClick(discipline, item, checked) {
      this.state.cSelected[discipline][item] = checked;
      console.log('ondisciplinechange')
      this.setState({cSelected: [...this.state.cSelected]})
      this.props.onDisciplineChange(discipline, item, checked, this.state.cSelected)
  }

  componentWillReceiveProps(nextProps) {
    let array_disciplines = []
    let array_grades = []
    if(nextProps.level.disciplines){
        nextProps.level.disciplines.map(discipline => {
            array_disciplines[discipline.id] = {
                first_grade:false, 
                second_grade:false, 
                third_grade:false, 
                fourth_grade:false, 
                fifth_grade:false, 
            }
        })
       this.state.cSelected = array_disciplines;
    }
    
    if(nextProps.level.code == 'ei' )
            this.state.grades = {first_grade: '2 anos', second_grade: '3 anos', third_grade: '4 anos', fourth_grade: '5 anos'}
    else if ( nextProps.level.code ==  'ef1' )
        this.state.grades = {first_grade: '1 ano', second_grade: '2 ano', third_grade: '3 ano', fourth_grade: '4 ano'}
    else if ( nextProps.level.code ==  'ef2' )
        this.state.grades = {first_grade: '5 ano', second_grade: '6 ano', third_grade: '7 ano', fourth_grade: '8 ano', fifth_grade: '9 ano'}
    else if ( nextProps.level.code ==  'em' )
        this.state.grades = {first_grade: '1 ano', second_grade: '2 ano', third_grade: '3 ano'}

    if(nextProps.contact.contactInfo){
        if(nextProps.contact.contactInfo.disciplines){
            nextProps.contact.contactInfo.disciplines.map(discipline => { 
                this.state.cSelected[discipline.discipline_id] = {
                    first_grade: discipline.first_grade,
                    second_grade: discipline.second_grade,
                    third_grade: discipline.third_grade,
                    fourth_grade: discipline.forth_grade,
                    fifth_grade: discipline. fifth_grade,
                }
            })
        }
    }

    return this.setState(this.state)
  }

  render() {
    let grades = this.state.grades;
    return (
      <div id="disciplines-contact-level">
        <Table responsive striped hover>
          <tbody>
              {this.props.level.disciplines.map((discipline, id) =>
                <tr key={id}>
                    <td key={{id}}>
                        {discipline.name}
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <div className="row" style={{justifyContent: 'space-evenly', alignContent: 'flex-end'}}>
                        {Object.keys(grades).map( (item, i) => (
                                <div key={i}>
                                    <Input 
                                        onChange={(event) => this.onCheckboxBtnClick(discipline.id, item, event.target.checked)} 
                                        type="checkbox" 
                                        id={item+"."+discipline.id} 
                                        checked={this.state.cSelected[discipline.id][item]}
                                        />
                                    <label htmlFor={item+"."+discipline.id}>{ grades[item] }</label>
                                </div>      
                             )
                            ) }
                        </div>
                    </td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>

    )
  }
}

const InitializeFromStateForm = connect(
    state => ({
        contact : state.contact,
        user: state.user,
    }),
)(SchoolDisciplineList)


export default InitializeFromStateForm
