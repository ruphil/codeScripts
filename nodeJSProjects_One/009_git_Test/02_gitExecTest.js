const fs = require('fs');
const { spawnSync} = require('child_process');

const gitFolderPath = 'C:/Users/rukmangadan/Documents/GitHub/gceStore';

var token = fs.readFileSync('../tokengit.txt', "utf-8");
const gitURL = `https://ruphil:${token}@github.com/ruphil/gceStore.git`;

// const gitPath = 'C:/Users/rukmangadan/Documents/GitHub/storeUpFromGCE/.git';
// let child = spawnSync('git', ['--git-dir', gitPath, 'add', './*']);

// let child = spawnSync('git', ['-C', gitFolderPath, 'add', './*']);
// // getOut(child);
// child = spawnSync('git', ['-C', gitFolderPath, 'commit', '-a', '-m', 'updating']);
// // getOut(child);
// child = spawnSync('git', ['-C', gitFolderPath, 'remote', 'set-url', 'origin', gitURL]);
// // getOut(child);
child = spawnSync('git', ['-C', gitFolderPath, 'fetch']);
if (!(child.stderr == "")){
    getOut(child);
    child = spawnSync('git', ['-C', gitFolderPath, 'pull', 'origin', 'master']);
    getOut(child);
}
// child = spawnSync('git', ['-C', gitFolderPath, 'push']);
// child = spawnSync('git', ['-C', gitFolderPath, 'fetch']);
// getOut(child);

function getOut(child){
    if (!(child.error == undefined)){
        console.log('error', child.error.toString());
    }
    if (!(child.stdout == "")){
        console.log('stdout ', child.stdout.toString());
    }
    if (!(child.stderr == "")){
        console.log('stderr ', child.stderr.toString());
    }
}
