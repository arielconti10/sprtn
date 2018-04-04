import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import config from '../../../config';

//import Dashboard from '../../../template/views/Dashboard/';

class Routes extends Component {

        //console.log(Dashboard);


    //teste = 'teste';

    state = {
        component: null
    }

    componentDidMount() {
        this.state.component = config.routes.items.map( key => {
            import('../../../template/views/Dashboard/Dashboard').then(cmp => {
    
                //console.log(cmp.default);
                return (
                    <Route path={key.path} component={() => '../../../template/views/Dashboard/Dashboard'} />
                    // <div>teste</div>
                )
            })
                    
        } );
    }

    
    

     

    //console.log(routeItems);
    render() {
        return (
            <div>{this.state.component}</div>
        )
    }
}

export default Routes;