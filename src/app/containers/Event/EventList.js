import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';
import {formatDateToBrazilian} from '../../common/DateHelper';
import { canUser } from '../../common/Permissions';

class EventList extends Component {
    constructor() {
        super();
        this.state = {
            viewMode: false,
            viewDeleteMode: false
        };
    }

    checkPermission() {
        canUser('event.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    checkDeletePermission() {
        canUser('event.delete', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewDeleteMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission();
        this.checkDeletePermission();
    }

    render() {

        return (
            <div>
                <GridApi
                    apiSpartan="event"
                    columns={[
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' },
                        {
                            Header: "Data Inicial",
                            filterable: true,
                            id: "start_date",
                            accessor: d => {
                                let date_brazilian = formatDateToBrazilian(d.start_date);
                                return date_brazilian;
                            }
                        },
                        { Header: "Horário Inicial", accessor: "start_time", filterable: true, headerClassName: 'text-left' },
                        { Header: "Duraçāo", accessor: "duration", filterable: true, headerClassName: 'text-left' }
                    ]}
                    blockEdit={this.state.viewMode}
                    blockDelete={this.state.viewDeleteMode}
                />
            </div>
        )
    }
}

export default EventList;