export default {
  path: '/',
  // component: require('../../../components/common/Layout').default,
  childRoutes: [
    {
      path: 'login',
      getComponent(nextState, cb){
        System.import('./containers/Login').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]

};
