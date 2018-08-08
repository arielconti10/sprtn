import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';
import GridApi from '../../common/GridApi';

class UserList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>

                    <GridApi
                        apiSpartan="user"
                        sortInitial="full_name"
                        columns={ [
                            { 
                                Header: "Nome", 
                                accessor: "full_name", 
                                filterable: true, 
                                headerClassName: 'text-left',
                                is_compost: true,
                                order_by: "name",
                                filter_by: ["name", "lastname"],
                                is_checked: true
                            },
                            { Header: "Email", accessor: "email", filterable: true, headerClassName: 'text-left', is_checked: true },
                            { Header: "Usuário", accessor: "username", width: 100, filterable: true, headerClassName: 'text-left', is_checked: true },                        
                            { Header: "Tipo", accessor: "role.name", filterable: true, headerClassName: 'text-left', sortable: false, is_checked: true },
                            { Header: "Superior", accessor: "superior_name", filterable: true, headerClassName: 'text-left', is_checked: true }, 
                        ] }
                        defaultOrder="name"
                        urlLink={this.props.match.url}
                    />

                </div>  
            </div>
        )
    }
}

export default UserList;