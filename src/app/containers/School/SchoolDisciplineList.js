import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Button, ButtonGroup } from 'reactstrap'
import {levelLoad} from '../../../actions/level'
class SchoolDisciplineList extends Component {
 
  constructor(props) {
    super(props)
    this.state = { cSelected: [], disciplines: [], shifts:[] };

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);

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


  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)

    switch(nextProps.level.code){
        case 'ei':
            return this.setState({
                shifts: ['2 anos', '3 anos', '4 anos', '5 anos']
            }) 
        case 'ef1':
            return this.setState({
                shifts: ['1 ano', '2 ano', '3 ano', '4 ano']
            }) 
        case 'ef2': 
            return this.setState({
                shifts: ['5 ano', '6 ano', '7 ano', '8 ano', '9 ano']
            }) 
        case 'em':
            return this.setState({
                shifts: ['1', '2', '3']
            }) 
    }
  }

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
              {this.props.level.disciplines.map(discipline =>
               <tr>
                <td>
                    {discipline.name}
                </td>
                <td style={{textAlign: 'right'}}>
                    <ButtonGroup>
                        {this.state.shifts.map(shift => 
                            <Button color="primary" onClick={() => this.onCheckboxBtnClick(shift)} active={this.state.cSelected.includes(shift)}>{shift}</Button>                
                        )}  
                    </ButtonGroup>
                </td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>

    )
  }
}

export default SchoolDisciplineList