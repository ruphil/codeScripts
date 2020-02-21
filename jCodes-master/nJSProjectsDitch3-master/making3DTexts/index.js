const fs = require('fs');
const convertHTMLToPDF = require('pdf-puppeteer');
const sleep = require('system-sleep');

var html = fs.readFileSync('./index.html', 'utf-8');

var topics = [
    "Indian Heritage<br/>and<br/>Culture",
    "History",
    "Society",
    "Geography",
    "Constitution<br/>and<br/>Polity",
    "Governance",
    "Social<br/>Justice",
    "International<br/>Relations",
    "Bio-diversity,<br/>Economic<br/>Development,<br/>Environment",
    "Technology",
    "Disaster<br/>Management",
    "Security"
];

topics.forEach(function (topic, index){
    // var topic = 'Indian Heritage<br/>and<br/>Culture';
    var index = 11;
    var topic = topics[index];
    var html_mod = html.replace('ABCDEFGHIJKLMNOPQRSTUVWXYZ', topic);

    convertHTMLToPDF(html_mod, pdf => {
        // var df = new Date().toLocaleTimeString().replace(' ', '').replace(':', '-').replace(':', '-');
        // console.log(df);
        fs.writeFileSync(`./topics_${index}.pdf`, pdf);
        console.log('written "', index, topic, '.pdf"');
    }, null, null, false);
    if (index != 11) sleep(3000);
});
