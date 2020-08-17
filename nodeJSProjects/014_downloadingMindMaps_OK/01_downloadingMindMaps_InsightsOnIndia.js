const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

let url = 'https://www.insightsonindia.com/insights-mindmaps-on-important-current-issues-for-upsc-civil-services-exam/';

let destPath = 'D:/jData/MindMaps/';

superagent.get(encodeURI(url)).then((resp)=>{
  getMindMaps(resp.text);
});

function getMindMaps(htmlStr){
  let $ = cheerio.load(htmlStr);
  let anchors = $('a[title*=MINDMAP]');
  console.log("Total Mindmaps:", anchors.length);
  for (let i = 0; i < anchors.length; i++) {
    const href = anchors[i].attribs.href;
    setTimeout(traverseOneMorePage, 1000 * i, href, i);
    // traverseOneMorePage(href, i);
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
  let jpg = $('a[href*=jpg]');
  downloadJPG(jpg[0].attribs.href, i);
}

function downloadJPG(link, i){
  let fileName = link.replace(/^.*[\\\/]/, '').replace("?ssl=1", "");
  // console.log(fileName);
  let filePath = destPath + fileName;
  const file = fs.createWriteStream(filePath);

  superagent.get(encodeURI(link)).pipe(file);
  file.on('finish', function() {
    file.close();
    console.log("S.No", i+1, "Downloaded:", fileName);
  });
}

