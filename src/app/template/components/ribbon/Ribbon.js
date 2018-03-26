/**
 * Created by griga on 11/24/15.
 */
import React from 'react'
import Mode from '../common/Mode'

export default class Ribbon extends React.Component {
  render() {
    return (
      <div id="ribbon">
        <Mode activeModeName='Mercado Privado' activeModeRote='#'
              standbyModeName='PNLD' standbyModeRote='#' />
      </div>
    )
  }
}
