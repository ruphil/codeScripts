const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

let url = 'https://www.drishtiias.com/mind-map/gs-paper3?page=3';

let destPath = 'D:/jData/MindMaps/';
let currentNumbering = 41;

superagent.get(encodeURI(url)).then((resp)=>{
  getMindMaps(resp.text);
});

function getMindMaps(htmlStr){
  let $ = cheerio.load(htmlStr);
  let anchors = $('li[class=no-image] > div[class=slide] > div[class=content] > a');
  console.log("Total Mindmaps:", anchors.length);
  for (let i = 0; i < anchors.length; i++) {
    const href = anchors[i].attribs.href;
    // console.log(href);
    setTimeout(traverseOneMorePage, 1000 * i, href, i);
  }
}

function traverseOneMorePage(href, i){
  // console.log(href);
  superagent.get(encodeURI(href)).then((resp)=>{
    downloadMindMaps(resp.text, i);
  });
}

function downloadMindMaps(htmlStr, i){
  let $ = cheerio.load(htmlStr);
  let img = $('a[rel=noopener]');
  // console.log(img[0].attribs.href);
  downloadJPG(img[0].attribs.href, i);
}

function downloadJPG(link, i){
  let currentSNo = currentNumbering;
  let fileName = currentNumbering + " " + link.replace(/^.*[\\\/]/, '').replace(/[^a-z.]/gi, '');
  
  // console.log(fileName);
  let filePath = destPath + fileName;
  const file = fs.createWriteStream(filePath);

  superagent.get(encodeURI(link)).pipe(file);
  file.on('finish', function() {
    file.close();
    console.log("S.No", currentSNo, "Downloaded:", fileName);
  });
  currentNumbering++;
}
