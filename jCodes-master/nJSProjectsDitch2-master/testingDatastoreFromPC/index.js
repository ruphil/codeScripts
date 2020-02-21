const {Datastore} = require('@google-cloud/datastore');
const fs = require('fs');


var pickBMP = fs.readFileSync('../../pick.bmp');

const datastore = new Datastore({
    projectId: 'testingwebsites',
});

const kind = 'Task';
const name = 'sampletask1';

const taskKey = datastore.key([kind, name]);

const task = {
    key: taskKey,
    data: {
      description: 'Buy milk',
      jack1: 'pick',
      jack1: pickBMP,
      jack11: 1,
      jack111: 1,
      jack1111: 1,
      jack11111: 1,
      jack111111: 1,
      jack12: 1,
      jack122: 1,
      jack1222: 1,
      jack12222: 1,
      jack13: 1,
      jack133: 1,
      jack13333: 1,
      jack14: 1,
      jack15: 1,
      jack14444: 1,
      jack123: 1,
      jack134: 1,
      jack145: 1,
      jack156: 1,
      jack167: 1,
    },
};

datastore.save(task);

console.log('done');