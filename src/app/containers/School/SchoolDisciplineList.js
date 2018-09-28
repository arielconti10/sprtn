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

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);

  }

  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }


  onCheckboxBtnClick(discipline, item) {
    console.log(discipline, item)

    this.setState({cSelected: {discipline: item}})
    // selected = {[grade]: selected}
    
    let index = this.state.cSelected.indexOf(discipline)

    console.log(index)
    
    if (index < 0) {
        this.state.cSelected.push(selected);
    } else {
        this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected]})
    console.log(this.state.cSelected)

    // this.setState({ cSelected: [...this.state.cSelected] });

    // console.log(this.state)
  }


  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)s

    switch(nextProps.level.code){
        case 'ei':
            return this.setState({
                grades: {first_grade: '2 anos', second_grade: '3 anos', third_grade: '4 anos', fourth_grade: '5 anos'}
            })
        case 'ef1':
            return this.setState({
                grades: {first_grade: '1 ano', second_grade: '2 ano', third_grade: '3 ano', fourth_grade: '4 ano'}
            })     
        case 'ef2':
            return this.setState({
                grades: {first_grade: '5 ano', second_grade: '6 ano', third_grade: '7 ano', fourth_grade: '8 ano', fifth_grade: '9 ano'}
            })   
        case 'efm':
            return this.setState({
                grades: {first_grade: '1', second_grade: '2', third_grade: '3'}
            })        
        }

  }

//   renderDisciplines(){
//     if(typeof this.state.disciplines !== 'undefined' && this.state.disciplines.length > 1) {

//         return this.state.disciplines.map(discipline => console.log(discipline))
//     }
//   }
  render() {
    let grades = this.state.grades;
    return (
      <div id="disciplines-contact-level">
        <Table responsive striped hover>
          <tbody>
              {this.props.level.disciplines.map((discipline, id) =>
                <tr >
                    <td >
                        {discipline.name}
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <div className="row">
                            {Object.keys(grades).map( (item, i) => (
                                <div className="col-sm-3">
                                    <Input onChange={() => this.onCheckboxBtnClick(discipline.id, item)} type="checkbox" id={item+"."+discipline.id} />
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