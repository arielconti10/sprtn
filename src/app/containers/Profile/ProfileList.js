import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';
import GridApi from '../../common/GridApi';

class ProfileList extends Component {

    render() {

        return (
            <div>
                <div className="action-button">
                    <GridApi
                        apiSpartan="profile"
                        columns={[
                            { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        urlLink={this.props.match.url}
                    />

                </div>  

            </div>
        )
    }
}

export default ProfileList;