$("#entiresite svg g").draggable({
  start: function(event, ui) {
    $(this).addClass('noclick');
  }
});
$("#entiresite svg g").click(function(){
    var url = $(this).children('circle').attr('metalink');
    window.open(url);
});