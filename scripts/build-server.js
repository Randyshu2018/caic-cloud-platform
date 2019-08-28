const shell = require('shelljs')

shell.echo('##########################')
shell.echo('#     Building WebServer     #')
shell.echo('##########################')

// shell.cd('wwwroot')
// const PUBLIC = '../spring/src/main/resources/public/'
// shell.rm('-rf', PUBLIC);
// if (shell.exec('npm run build').code !== 0) {
//   shell.echo('Error: vue build failed')
//   shell.exit(1)
// }

shell.cp('-R', 'dist/*.yml', "wwwroot/");
shell.cp('-R', 'dist/*.dmg', "wwwroot/");
shell.cp('-R', 'dist/*.zip', "wwwroot/");
shell.cp('-R', 'dist/*.exe', "wwwroot/");
// shell.cd('..')

shell.echo('##########################')
shell.echo('#     Start WebServer    #')
shell.echo('##########################')

if (shell.exec('node_modules/.bin/http-server wwwroot/ -p 8080').code !== 0) {
  shell.echo('Error start webServer')
  shell.exit(1)
}
