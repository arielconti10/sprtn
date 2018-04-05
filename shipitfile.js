// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      deployTo: '/var/www/html/ftdspartanf',
      repositoryUrl: 'https://bitbucket.org/editora-ftd/ftdspartanf',
      branch: 'staging',
      keepReleases: 3
    },
    staging: {
       servers: 'ftdiw@mtz-webh02',
       key: '/Users/tercmt-henrique/Desktop/deploy.pem'
    },
  });

  shipit.task('permissions', () => {
    shipit.remote('chmod -R 755 /var/www/html/ftdspartanf/releases').then(function(){
        shipit.remote('cd /var/www/html/ftdspartanf/current && npm run build');
      });
  });

}
