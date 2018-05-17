import React from 'react'

export default props => (
    <span className='pull-right school-header-students'>
        <span className={`circle ${props.portfolio ? 'check' : 'exclamation'}`} title={`Carteira ${props.portfolio ? '' : 'não '}distribuida`}><i className={`fa fa-${props.portfolio ? 'check' : 'exclamation'}-circle`}></i></span>
        <span className={`globe ${props.active ? 'active' : 'inactive'}`} title={`Escola ${props.active ? 'ativa' : 'inativa'}`}><i className="fa fa-globe"></i></span>
        <span title='Total de alunos ensino infantil'>EI <strong>{props.eiStudents}</strong>, </span> 
        <span title='Total de alunos ensino fundamental I'>EFI <strong>{props.ef1Students}</strong>, </span> 
        <span title='Total de alunos ensino fundamental II'>EFII <strong>{props.ef2Students}</strong>, </span> 
        <span title='Total de alunos ensino médio'>EM <strong>{props.emStudents}</strong>, </span> 
        <span title='Total de alunos da escola'><i className="fa fa-group"></i> {props.numStudents}</span>
    </span>
)