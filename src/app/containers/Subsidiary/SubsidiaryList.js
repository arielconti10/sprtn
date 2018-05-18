import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';
import { canUser } from '../../common/Permissions';

class SubsidiariesList extends Component {
    constructor() {
        super();
        this.state = {
            viewMode: false,
            viewDeleteMode: false
        };
    }

    checkPermission() {
        canUser('subsidiary.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    checkDeletePermission() {
        canUser('subsidiary.delete', this.props.history, "change", function(rules){
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
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>

                <GridApi
                    apiSpartan="subsidiary"
                    columns={[
                        { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' }
                    ]}
                    blockEdit={this.state.viewMode}
                    blockDelete={this.state.viewDeleteMode}
                />
            </div>
        )
    }
}

export default SubsidiariesList;