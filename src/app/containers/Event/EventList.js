import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';
import {formatDateToBrazilian} from '../../common/DateHelper';

class EventList extends Component {

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
                />
            </div>
        )
    }
}

export default EventList;