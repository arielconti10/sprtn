// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      deployTo: '/var/www/html/ftdspartanf',
      repositoryUrl: 'git@bitbucket.org:editora-ftd/ftdspartanf.git',
      branch: 'staging',
      keepReleases: 3
    },
    staging: {
       servers: 'ftdiw@mtz-webh02',
       key: '/home/jenkins/.ssh-deploy-keys/mtz-webh02/deploy.pem'
    },
    production: {
        servers: 'ftdiw@mtz-webp02:2223',
        key: '/home/jenkins/.ssh-deploy-keys/mtz-webp02/deploy.pem',
        port: '2223'
     },
  });

  shipit.task('permissions', () => {
    let hostname = shipit.remote('hostname').then(function(hostname){
        if (hostname[0].stdout.trim() === "mtz-webh02") {
            shipit.remote('chmod -R 755 /var/www/html/ftdspartanf/releases').then(function(){
                shipit.remote('cd /var/www/html/ftdspartanf/current && npm run build_staging');
            });
        } else {
            shipit.remote('chmod -R 755 /var/www/html/ftdspartanf/releases').then(function(){
                shipit.remote('cd /var/www/html/ftdspartanf/current && npm run build');
            });
        }
    })
  });

}