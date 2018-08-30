import React from 'react'
import { formatNumber } from '../../common/FormatHelper';

export default props => (
    <span className='pull-right school-header-students'>
        <span className={`portfolio ${props.portfolio ? 'suitcase' : 'exclamation'}`} title={`Carteira ${props.portfolio ? '' : 'não '}distribuída`}><i className='fa fa-suitcase'></i></span>
        <span className={`globe ${props.active ? 'active' : 'inactive'}`} title={`Escola ${props.active ? 'ativa' : 'inativa'}`}><i className={`fa fa-${props.active ? 'smile-o' : 'frown-o'}`}></i></span>
        <span title='Total de alunos ensino infantil'>EI <strong>{formatNumber(props.eiStudents)}</strong>, </span> 
        <span title='Total de alunos ensino fundamental I'>EFI <strong>{formatNumber(props.ef1Students)}</strong>, </span> 
        <span title='Total de alunos ensino fundamental II'>EFII <strong>{formatNumber(props.ef2Students)}</strong>, </span> 
        <span title='Total de alunos ensino médio'>EM <strong>{formatNumber(props.emStudents)}</strong>, </span> 
        <span title='Total de alunos da escola'><i className="fa fa-group"></i> {formatNumber(props.numStudents)}</span>
    </span>
)