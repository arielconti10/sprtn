import React, { Component } from 'react'

export default class InputCustomize extends Component {
    render() {
        return (
            <div className={this.props.cols} >
                <div className="form-group">
                    <input {...this.props} />
                    {this.props.helperText != "" && 
                        <small id="passwordHelp" className="form-text text-muted center-help">{this.props.helperText}</small>
                    }
                </div>
            </div>
        )
    }
}