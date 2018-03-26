export default {
  path: '/',
  component: require('../../template/components/common/Layout').default,
  childRoutes: [
    {
      path: 'job-titles',
      getComponent(nextState, cb){
        System.import('./containers/JobTitles').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]

};
