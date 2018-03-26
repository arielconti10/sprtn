import React from 'react'
import Grid from '../common/grid'

export default props => (
    <Grid cols='12 7 7 4'>
        <h1><i className={`fa fa-${props.icon}`}></i> {props.title} <small>> {props.small}</small></h1>
    </Grid>
)