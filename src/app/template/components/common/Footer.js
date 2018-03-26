/**
 * Created by griga on 11/24/15.
 */

import React from 'react'

import {Dropdown, MenuItem} from 'react-bootstrap'

export default class Footer extends React.Component {
    render(){
        return (
            <div className="page-footer">
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <span className="txt-color-white">
                            Copyright &copy; 2018 Spartan - Desenvolvido por <a className="txt-color-white" href='https://ftd.com.br/' target='_blank'> FTD Educação</a>. Todos os direitos reservados.
                        </span>
                    </div>                    
                </div>
            </div>
        )
    }
}