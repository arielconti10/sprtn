import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import './Login.css';
import InputCustomize from '../../common/InputCustomize';
import loginRequest from '../../../actions/login'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Full from '../../../../src/template/containers/Full/Full'
import Dashboard from '../../../template/views/Dashboard/Dashboard';

// If you were testing, you'd want to export this component
// so that you can test your custom made component and not
// test whether or not Redux and Redux Form are doing their jobs
class Login extends Component {
  // Pass the correct proptypes in for validation
  static propTypes = {
    handleSubmit: PropTypes.func,
    loginRequest: PropTypes.func,
    login: PropTypes.shape({
      requesting: PropTypes.bool,
      successful: PropTypes.bool,
      messages: PropTypes.array,
      errors: PropTypes.array,
    }),
  }

  // Remember, Redux Form passes the form values to our handler
  // In this case it will be an object with `username` and `password`
  submit = (values) => {
    this.props.loginRequest(values)
  }

  render() {
    const {
      handleSubmit, // remember, Redux Form injects this into our props
      login: {
        requesting,
        successful,
        messages,
        errors,
      },
    } = this.props

    return (
      <div id="login-body">
        <div>
          <section className="login-form">
            <h1>
              <img src="./img/logo.png" // place your logo here
                alt="Spartan" className="main-logo" />
            </h1>
            <form className="widget-form" onSubmit={handleSubmit(this.submit)}>
              <h1>LOGIN</h1>
              <div className="row">
                <InputCustomize
                  className="form-control"
                  placeholder="Seu Login"
                  helptext=""
                  cols="col-lg-12 col-md-12 col-sm-12"
                  name="username"
                  type="text"
                  id="username"
                  component="input"
                />
              </div>
              <div className="row">
                <InputCustomize
                  className="form-control"
                  placeholder="Sua Senha"
                  helptext="Você deve informar as suas credenciais de rede"
                  cols="col-lg-12 col-md-12 col-sm-12"
                  name="password"
                  type="password"
                  id="password"
                  component="input"
                />
              </div>
              <button action="submit" className="btn btn-primary btn-block">Acessar</button>
            </form>
          </section>
        </div>
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({
  login: state.login,
})

// make Redux state piece of `login` and our action `loginRequest`
// available in this.props within our component
const connected = connect(mapStateToProps, { loginRequest })(Login)

// in our Redux's state, this form will be available in 'form.login'
const formed = reduxForm({
  form: 'login',
})(connected)

// Export our well formed login component
export default formed
