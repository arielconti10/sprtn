import React, { Component } from 'react';

export default class IndicatorNumber extends Component {
    render() {
        const { cols, backgroundColor, icon, total, label, shadowClass} = this.props;
        return (
            <div className={cols}>
                <div className={`text-white ${backgroundColor} ${shadowClass} card-indicator`}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2 padding-icon">
                                <i className={`fa ${icon} fa-4x`}></i>
                            </div>
                            <div className="col-md-6">
                                <div className="text-indicator">{total}</div>
                                <div>{label}</div>
                            </div>
                        </div>
                        

                    </div>
                </div>
            </div>
        );
    }
}