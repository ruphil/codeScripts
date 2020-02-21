const fs = require('fs');
const handlebars = require('handlebars');

function getHomePage(){
    const source = fs.readFileSync('./rHomePage/homePage.html', 'utf8');
    var template = handlebars.compile(source);
    data = null;
    var html = template(data);
    return html;
}

module.exports = {
   getHomePage
}
