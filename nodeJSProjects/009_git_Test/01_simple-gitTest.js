const fs = require('fs');
const git = require('simple-git');

var token = fs.readFileSync('../tokengit.txt', "utf-8");
// console.log(token);

const gitPath = 'C:/Users/rukmangadan/Documents/GitHub/storeUpFromGCE';
// const gitPath = '/home/rukmangadanies/storeUpFromGCE';
// const gitPath = 'D:/storeUpFromGCE';
const gitURL = `https://ruphil:${token}@github.com/ruphil/storeUpFromGCE.git`;

git(gitPath)
.add("./*")
.addConfig('user.name', 'ruphil')
.addConfig('user.email', 'rukmangadanies@gmail.com')
.commit("p")
.removeRemote('origin')
.addRemote('origin', gitURL)
.push('origin', 'master', () => console.log('done'));
