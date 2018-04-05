// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      deployTo: '/home/ftdiw/spartan-teste/app',
      repositoryUrl: 'https://bitbucket.org/editora-ftd/ftdspartanf',
      branch: 'staging',
    },
    staging: {
       servers: 'ftdiw@mtz-webh02',
       key: 'deploy.pem'
    //  servers: [{
    //    host: 'mtz-webh02',
    //    user: 'ftdiw',
    //    password: 'a1s2d3'
    //  }]
    },
  });

//   shipit.task('update-server', function () {
//     return shipit.remote('npm install');
//   });

//   shipit.task('build-server', function () {
//     return shipit.remote('npm run build');
//   });

//   shipit.on('finish', function() {
//     shipit.start('update-server');
//     shipit.start('build-server');
//   })

}
