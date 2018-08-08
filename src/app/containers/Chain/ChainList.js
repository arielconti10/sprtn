import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button  } from 'reactstrap';
import GridApi from '../../common/GridApi';

class ChainList extends Component {
    render() {
        return (
            <div>
                <div className="action-button">
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                    <GridApi
                        apiSpartan="chain"
                        columns={[
                            { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left', is_checked: true }
                        ]}
                        urlLink={this.props.match.url}
                    />

                </div>  
            </div>
        )
    }
}

export default ChainList;