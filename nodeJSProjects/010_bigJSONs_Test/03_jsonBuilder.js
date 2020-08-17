const fs = require('fs');
const jsonBuilder = require('json-builder');

const jsonPath = 'D:/jData/jsonBuilder.json';

const stream = fs.createWriteStream(jsonPath);
const out = jsonBuilder.stream(stream);

out.map()
.key('title-row')
.list()
.val({a: 'an object'})
.val(['a', 'list!', 1, 11])
.json('{"some JSON": "as well"}')

out.close();