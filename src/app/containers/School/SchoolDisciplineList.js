import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Button, ButtonGroup } from 'reactstrap'
import {levelLoad} from '../../../actions/level'
class SchoolDisciplineList extends Component {
 
  constructor(props) {
    super(props)
    this.state = { cSelected: [], disciplines: [] };

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    console.log(this.props)
  }

  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }

  onCheckboxBtnClick(selected) {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

//   componentDidMount() {      
//     this.props.levelLoad(this.props.user, this.props.level.id)
//   }

//   componentWillReceiveProps(nextProps) {
//       this.setState({disciplines: nextProps.level.disciplines})
//   }

//   renderDisciplines(){
//     if(typeof this.state.disciplines !== 'undefined' && this.state.disciplines.length > 1) {

//         return this.state.disciplines.map(discipline => console.log(discipline))
//     }
//   }
  render() {
    return (
      <div id="disciplines-contact-level">
        <Table responsive striped hover>
          <tbody>
              {this.props.level.disciplines.map(discipline => <tr>{discipline.name}</tr>)}

          </tbody>
        </Table>
      </div>

    )
  }
}

export default SchoolDisciplineList