import React, { Component } from 'react'
import { Field } from 'redux-form'

export default class InputCustomize extends Component {
    render() {
        return (
            <div className={this.props.cols} >
                <div className="form-group">
                    {this.props.label != undefined ?
                        <label for={this.props.id}>{this.props.label}</label> : ""
                    }
                    <Field {...this.props} ref={input => this.internal_code = input}/>
                    {this.props.helptext != "" ? 
                        <small id="passwordHelp" className="form-text text-muted center-help">{this.props.helptext}</small> : ""
                    }
                </div>
            </div>
        )
    }
}