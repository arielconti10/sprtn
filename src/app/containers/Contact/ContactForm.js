import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardHeader, CardFooter, CardBody, Button } from 'reactstrap';
import { FormWithConstraints, FieldFeedback } from 'react-form-with-constraints';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from 'react-form-with-constraints-bootstrap4';


const apiSelectBox = 'job-title-type';
const apiPost = 'job-title';

class ContactForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Teste</h1>
            </div>
        )
    }
}

export default ContactForm;