const express = require('express');
const app = express();
var bodyParser = require('body-parser');

const hp = require('./rHomePage/homePage');
const cs = require('./rCivilServices/civilServices');
const cs2 = require('./rCivilServicesV2/civilServicesV2');

app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());

app.use('/favicon.ico', express.static('./essentials/favicon.ico'));

// Home Page 
app.get('/',function (req, res){
    var content = hp.getHomePage();
    res.send(content);
});

// Civil Services 
app.get('/civilservices',function (req, res){
    var thirukkuralSheetID = '1BXc42CL0OOjU7fn2pTupBpAH2YFmSVkTAMD4a1TjxMs';
    cs.civilservices(res, thirukkuralSheetID);
});

app.get('/filehelpercs',function (req, res){
    cs.fileHelperCS(req, res);
});

// Civil Services Version 2
app.get('/civilservicesv2',function (req, res){
    cs2.civilServicesMain(req, res);
});

app.get('/contentmanagercs',function (req, res){
    cs2.contentManagerMain(req, res);
});

app.post('/contentmanagercsajax',function (req, res){
    cs2.contentManagerAjaxHelper(req, res); 
});

app.post('/filehandlercs',function (req, res){
    cs2.contentManagerFileHandler(req, res); 
});

app.get('/fetchfile',function (req, res){
    cs2.fetchFile(req, res);
});

app.get('/*',function (req, res){
    var content = 'This Path " ' + req.path + ' " is Not Found Dear';
    res.send(content);
});

app.listen(8080);
