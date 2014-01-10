var primus = new Primus(location.origin.replace(/^http/, 'ws'));
var callbacks = primus.channel('callbacks');

callbacks.on('data', function (data) {
  var id = new Date().getTime();
  var item = $('<a class="list-group-item" data-id="' + id + '">' + new Date().toLocaleTimeString() + '</a>');
  var content = $('<pre data-id="' + id + '">' + JSON.stringify(data, undefined, 2) + '</pre>');

  if ($('.waiting').length) {
    $('.waiting').remove();
    content.addClass('active');
    item.addClass('active');
  }

  item.hide().appendTo('.callback-nav').fadeIn();
  content.appendTo('.callback-content');
});

$('.callback-nav').on('click', 'a[data-id]', function(e){
  e.preventDefault();

  var id = $(this).data('id');
  $('.active').removeClass('active');
  $('[data-id="' + id + '"]').addClass('active');
});

primus.on('open', function () {
  $('.status').delay(750).fadeOut(function(){
    $(this).text('is listening at ' + window.location.origin).fadeIn();
  });
});