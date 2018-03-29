import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardHeader, CardFooter, CardBody, Button} from 'reactstrap';

class JobTitleForm extends Component {

    render() {
        console.log(this.props);
        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-table"></i>Cargos
                </CardHeader>
                <CardBody>  
                    <Button color='primary' onClick={this.props.history.goBack}><i className="fa fa-arrow-circle-left"></i> Voltar</Button>                    
                    formulario
                </CardBody>
            </Card>
        )
    }
}

export default JobTitleForm;