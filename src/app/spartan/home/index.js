export default {
  component: require('../../template/components/common/Layout').default,

  childRoutes: [
    {
      path: 'home',
      getComponent(nextState, cb){
        System.import('./containers/Home').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]

};
