import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

class EventList extends Component {

    render() {

        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Eventos
                </CardHeader>
                <CardBody>  
                    <p>
                        <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>                        
                    </p>
                    <div>
                    <GridApi
                        apiSpartan="event"
                        columns={[
                            { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' },
                            { Header: "Data Inicial", accessor: "start_date", filterable: true, headerClassName: 'text-left' },
                            { Header: "Horário Inicial", accessor: "start_time", filterable: true, headerClassName: 'text-left' },
                            { Header: "Duraçāo", accessor: "duration", filterable: true, headerClassName: 'text-left' }
                        ]}
                    />
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default EventList;