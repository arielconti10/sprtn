export default {
  path: '/',
  component: require('../../template/components/common/Layout').default,
  childRoutes: [
    {
      path: 'localization-types',
      getComponent(nextState, cb){
        System.import('./containers/LocalizationTypes').then((m)=> {
          cb(null, m.default)
        })
      }
    },
    {
        path: 'localization-types/create',
        getComponent(nextState, cb){
          System.import('./containers/LocalizationTypesForm').then((m)=> {
            cb(null, m.default)
          })
        }
    },
    {
        path: 'localization-types/update(/:id)',
        getComponent(nextState, cb){
          System.import('./containers/LocalizationTypesForm').then((m)=> {
            cb(null, m.default)
          })
        }
    },
  ]

};