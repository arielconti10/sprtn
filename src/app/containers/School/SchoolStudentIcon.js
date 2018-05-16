import React from 'react'

export default props => (
    <span className='pull-right school-header-students'>
        <span>EI <strong>{props.eiStudents}</strong>, </span> 
        <span>EFI <strong>{props.ef1Students}</strong>, </span> 
        <span>EFII <strong>{props.ef2Students}</strong>, </span> 
        <span>EM <strong>{props.emStudents}</strong>, </span> 
        <span><i className="fa fa-group"></i> {props.numStudents}</span>
    </span>
)