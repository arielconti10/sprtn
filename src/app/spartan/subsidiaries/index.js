export default {
  path: '/',
  component: require('../../template/components/common/Layout').default,
  childRoutes: [
    {
      path: 'subsidiaries',
      getComponent(nextState, cb){
        System.import('./containers/Subsidiaries').then((m)=> {
          cb(null, m.default)
        })
      }
    },
    {
        path: 'subsidiaries/create',
        getComponent(nextState, cb){
          System.import('./containers/SubsidiariesForm').then((m)=> {
            cb(null, m.default)
          })
        }
    },
    {
        path: 'subsidiaries/update(/:id)',
        getComponent(nextState, cb){
          System.import('./containers/SubsidiariesForm').then((m)=> {
            cb(null, m.default)
          })
        }
    },
  ]

};