import React, { Component } from 'react';
import { Card, CardHeader, CardFooter, CardBody, Button, Collapse, Row, Col } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { PropTypes } from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { 
    loadDistributionListFlow
} from '../../../actions/distribution'

class SchoolDistributionList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const school = this.props.school;
        if (school.users !== nextProps.school.users) {
            const userList = nextProps.school.users;
            this.props.loadDistributionListFlow(userList);
        }
    }

    render() {
        const { distributionList } = this.props.distribution;

        return (
            <div>
                <div>
                    <Row>
                        <Col md="12">
                            <ReactTable
                                columns={[
                                    { Header: "Login", accessor: "username", headerClassName: 'text-left' },
                                    { Header: "Nome", accessor: "full_name", headerClassName: 'text-left' },
                                    { Header: "E-mail", accessor: "email", headerClassName: 'text-left' }
                                ]}
                                data={distributionList}
                                defaultPageSize={5}
                                previousText='Anterior'
                                nextText='Próximo'
                                loadingText='Carregando...'
                                noDataText='Sem registros'
                                pageText='Página'
                                ofText='de'
                                rowsText=''
                                className='-striped -highlight'
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

const mapStateToProps =(state) => ({
    distribution : state.distribution
});

const functions_object = {
    loadDistributionListFlow
}

export default connect(mapStateToProps, functions_object )(SchoolDistributionList);