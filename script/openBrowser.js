const child_process = require('child_process');

const url = 'http://127.0.0.1:80';

if (process.platform == 'wind32') {
  cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
} else if (process.platform == 'linux') {
  cmd = 'xdg-open';
} else if (process.platform == 'darwin') {
  cmd = 'open';
}
child_process.exec(`${cmd} "${url}"`);
