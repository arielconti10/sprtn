import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';

import axios from '../../common/axios';
import GridApi from '../../common/GridApi';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import { canUser } from '../../common/Permissions';

class RuleList extends Component {
    constructor() {
        super();
        this.state = {
            viewMode: false,
            viewDeleteMode: false
        };
    }

    checkPermission() {
        canUser('rule.update', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    checkDeletePermission() {
        canUser('rule.delete', this.props.history, "change", function(rules){
            if (rules.length == 0) {
                this.setState({viewDeleteMode:true, submitButtonDisabled: true});
            }
        }.bind(this));       
    }

    componentWillMount() {
        this.checkPermission();
        this.checkDeletePermission();
    }
    handleSelectChange = (selectedOption) => {

        const role_id = selectedOption.map(function(item) {
            return item.id;
        });

        this.setState({ role_id: role_id });
    }

    render() {

        return (
            <div>
                <p>
                    <NavLink to={this.props.match.url + "/novo"} exact><Button color='primary' ><i className="fa fa-plus-circle"></i> Adicionar</Button></NavLink>
                </p>

                <GridApi
                    apiSpartan="rule"
                    columns={[
                        // { Header: 'ID', accessor: 'id', filterable: true, width: 100, headerClassName: 'text-left' },
                        { Header: "Código", accessor: "code", filterable: true, headerClassName: 'text-left' },
                        { Header: "Nome", accessor: "name", filterable: true, headerClassName: 'text-left' }
                    ]}
                    columnsAlt={[
                        { Header: 'Regras', accessor: 'roles', filterable: true, name: 'role_id', width: 400, type:'selectMulti', api: 'role', headerClassName: 'text-left'},
                    ]}
                    blockEdit={this.state.viewMode}
                    blockDelete={this.state.viewDeleteMode}
                />
            </div>
        )
    }
}

export default RuleList;