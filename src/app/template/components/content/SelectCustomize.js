import React, { Component } from 'react';
import Select2 from 'react-select2-wrapper';

export default class SelectCustomize extends Component {
    render() {
        return(
            <div className={this.props.cols}>
                <div className="form-group">
                    <label for={this.props.id}>{this.props.label}</label>
                    <select className="form-control">
                    {
                        this.props.dataContent.map(data => {
                            return (
                                <option value={data.id}>{data.name}</option>
                            ) 
                        })
                    }
                    </select>
                </div>
            </div>
        )
    }
}