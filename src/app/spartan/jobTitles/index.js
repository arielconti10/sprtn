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
    {
        path: 'job-titles/create',
        getComponent(nextState, cb){
          System.import('./containers/JobTitlesForm').then((m)=> {
            cb(null, m.default)
          })
        }
    },
  ]

};

/*
    {
      path: 'jquery-ui',
      getComponent(nextState, cb){
        System.import('./containers/JQueryUi').then((m)=> {
          cb(null, m.default)
        })
      }
    },
*/