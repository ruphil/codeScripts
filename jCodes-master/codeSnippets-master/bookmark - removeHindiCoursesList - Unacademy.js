javascript: { 
var script = document.createElement('script');
script.type = 'text/javascript';

document.head.appendChild(script);
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";

script.onload = function (){
var elems = $('div[class*=conceptCourseWrapper]');
  for(var i=0; i < elems.length; i++){ 
    if(elems[i].textContent.indexOf('Hindi') >= 0 ){ 
      $(elems[i]).css({"display":"none"}); 
    } 
  }
}

}
