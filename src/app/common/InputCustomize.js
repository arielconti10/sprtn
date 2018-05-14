import React, { Component } from 'react'

export default class InputCustomize extends Component {
    render() {
        return (
            <div className={this.props.cols} >
                <div className="form-group">
                    {this.props.label != undefined ?
                        <label for={this.props.id}>{this.props.label}</label> : ""
                    }
                    <input {...this.props} ref={input => this.internal_code = input}/>
                    {this.props.helptext != "" ? 
                        <small id="passwordHelp" className="form-text text-muted center-help">{this.props.helptext}</small> : ""
                    }
                </div>
            </div>
        )
    }
}