import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Button, ButtonGroup } from 'reactstrap'
import {levelLoad} from '../../../actions/level'
class SchoolDisciplineList extends Component {
  static propTypes = { 
    levelLoad: PropTypes.func,
    level: PropTypes.shape({

    })
  }

  constructor(props) {
    super(props)
    this.state = { cSelected: [] };

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

  componentDidMount() {
    this.props.levelLoad(this.props.level.id)
  }

  render() {

    return (
      <div id="disciplines-contact-level">
        <Table responsive striped hover>
          <tbody>
            <tr>
              <td scope="row">Língua Portuguesa</td>
              <td style={{textAlign: "right"}}>
                <ButtonGroup>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(1)} active={this.state.cSelected.includes(1)}>2 anos</Button>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(2)} active={this.state.cSelected.includes(2)}>3 anos</Button>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(3)} active={this.state.cSelected.includes(3)}>4 anos</Button>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(4)} active={this.state.cSelected.includes(4)}>5 anos</Button>
                </ButtonGroup>
              </td>
            </tr>
            <tr>
              <td scope="row">Matemática</td>
              <td style={{textAlign: "right"}}>
                <ButtonGroup>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(1)} active={this.state.cSelected.includes(1)}>2 anos</Button>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(2)} active={this.state.cSelected.includes(2)}>3 anos</Button>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(3)} active={this.state.cSelected.includes(3)}>4 anos</Button>
                  <Button color="primary" onClick={() => this.onCheckboxBtnClick(4)} active={this.state.cSelected.includes(4)}>5 anos</Button>
                </ButtonGroup>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
    user: state.user, 
    // level: state.level,
});

const functions_object = {
   loadLevel
}

export default connect(mapStateToProps, functions_object )(SchoolDisciplineList);

