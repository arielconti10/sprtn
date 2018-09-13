import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    FormGroup, Label, Input } from 'reactstrap';
import { verifySelectChecked, createTable, savePreferences, verifyPreferences } from '../../common/ToggleTable'; 
import GridApi from '../../common/GridApi';
import {formatDateToBrazilian} from '../../common/DateHelper';
import { canUser } from '../../common/Permissions';

class EventList extends Component {
    render() {
        return (
            <div className="table-without-expand">
                <div className="action-button">
                    <GridApi
                        apiSpartan="event"
                        columns={[
                            { Header: "Nome", accessor: "name", id: "name" ,filterable: true, headerClassName: 'text-left', is_checked: true },
                            {
                                Header: "Data Inicial",
                                filterable: true,
                                id: "start_date",
                                is_checked: true,
                                accessor: d => {
                                    let date_brazilian = formatDateToBrazilian(d.start_date);
                                    return date_brazilian;
                                }
                            },
                            { Header: "Horário Inicial", accessor: "start_time", id: "start_time" ,filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Duraçāo", accessor: "duration", id: "duration" ,filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        urlLink={this.props.match.url}
                        hideFirstButton={true}
                    />
                </div>  
            </div>
        )
    }
}

export default EventList;