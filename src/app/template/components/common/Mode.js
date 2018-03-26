import React from 'react'

export default props => (
    <div>
        <div className='ribbon-button-alignment pull-left'>
            <span className='txt-color-white'>Você está no modo <i className='fa fa-caret-right'></i> <strong><a href={props.activeModeUrl}>{props.activeModeName}</a></strong></span>
        </div>
        <div className='ribbon-button-alignment pull-right'>
            <span className='txt-color-white'>Alternar para o modo <strong> <a href={props.standbyModeUrl}>{props.standbyModeName}</a></strong></span>
        </div>
    </div>
)
