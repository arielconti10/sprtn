export default {
  path: '/',
  // component: require('../../../components/common/Layout').default,
  childRoutes: [
    {
      path: 'logout',
      getComponent(nextState, cb){
        System.import('./containers/Logout').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]

};
