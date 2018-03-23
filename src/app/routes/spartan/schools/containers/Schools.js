import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../../../components/content/contentHeader'
import Content from '../../../../components/content/content'
import Row from '../../../../components/common/row'
import Grid from '../../../../components/common/grid'

import SchoolsParams from './SchoolsParams'
import content from '../../../../components/content/content';

import Datatable from '../../../../components/tables/Datatable'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

import SchoolsList from './SchoolsList2'

export default class Schools extends Component {
    render() {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBhZTgzMzdiZDg0NzVlMTRmNTMzNWQyZjhiMmQ3ZWExYWNmZjg1YWNkMjVmMmZmYzBiNjU3MDIzZmExOGU1MWJlNzc4MTkyZDk3NWNmZDdiIn0.eyJhdWQiOiIyIiwianRpIjoiMGFlODMzN2JkODQ3NWUxNGY1MzM1ZDJmOGIyZDdlYTFhY2ZmODVhY2QyNWYyZmZjMGI2NTcwMjNmYTE4ZTUxYmU3NzgxOTJkOTc1Y2ZkN2IiLCJpYXQiOjE1MjE3NTY5NTAsIm5iZiI6MTUyMTc1Njk1MCwiZXhwIjoxNTIxODQzMzUwLCJzdWIiOiIxMzM4Iiwic2NvcGVzIjpbXX0.bWDW47yPO639Wmdi582TepkcXdOy2Pc55udFCKxQEh3t8jVaGRvKu4GtrXLFhZNV5Feyh1pjyDoaAgNQbEL3lIKonjWrlld4VgmZyTLwE2v5XMk8F7NPGnQyZNt8E5lcUowt4wGvV0choU4_P1oXdH1Q0DVtf4L_i3v0wuPFc0NaGBQ5waeKv7hkS44kVH6D463KNqmahotc86705JdYoei9PbY_VfZ74Rvfg0iZdtP9agMMAuOA5QuD4qx-wjFf3jJOvkMASf-Pc3eMte-aTRoG2FfQd-DZDAU6juDYjT2ifJ3bkvOaG5FNNL1aqJKVslqJnQ7oxQAZj-11RHokCJRYK5ucVHM2ijdAtrZ4Yq7VCiP3u-2c2e7E8xgDUqdz8NwSVbar9GQIJRmnQM8yn7SxuHDBn6l6otK7ooyfVrx1QKAHUuNuK-bEwGvzOPJBlByN-UBTI2cE0ecfjAZAWP5vI4LCxt82Ywe9UQ3lbaPqv8-YAjseiS47Z0yMJeFVOWXK6eYTNFh8MosHnpfXcqyMU4rojdb_S8qAF5Znh3tzsdRvqQhB0J0Jvb0sLFyjK5CH12Au8FmuwVB9DhQlGZfr14etDwi1k5ZRPg9XnRgGq_YyFticheuq-hPpWDcTnbCqWVGH6LafUzjINpQe3YmT0J6sDILB-degxqWwVCg'

        return ( 
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Carteira', 'Escolas']} icon="fa fa-fw fa-suitcase"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4" />
                </div>

                <WidgetGrid>

                    <div className="row">
                        <article className="col-sm-12">

                            <JarvisWidget editbutton={false} color="darken" deletebutton={false} colorbutton={false} >
                                <header>
                                    <span className="widget-icon"> <i className="fa fa-table" /> </span> 
                                    <h2>Escolas</h2>
                                </header>
                                <div>
                                    <div className="widget-body no-padding">
                                    
                                        
                                        <SchoolsList />

                                    </div>
                                </div>
                            </JarvisWidget>  

                        </article>
                    </div>

                </WidgetGrid>

            </div>
        )
    }
}
