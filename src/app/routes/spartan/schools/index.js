export default {
  path: 'spartan',
  component: require('../../../components/common/Layout').default,
  childRoutes: [
    {
      path: 'schools',
      getComponent(nextState, cb){
        System.import('./containers/Schools').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]

};
