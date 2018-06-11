import React, { Component } from 'react';

export default class IndicatorNumber extends Component {
    render() {
        const { cols, backgroundColor, icon, total, label} = this.props;
        return (
            <div className={cols}>
                <div className={`text-white ${backgroundColor} card-indicator`}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <i className={`fa ${icon} fa-4x`}></i>
                            </div>
                            <div className="col-md-10">
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