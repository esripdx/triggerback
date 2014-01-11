var primus = new Primus(location.origin.replace(/^http/, 'ws'));
var url = window.location.toString();
var id = window.location.pathname.substring(1);
var channel = primus.channel(id);
var notify = {};

notify.success = function () {
  $('.status').text('is listening at ' + url).fadeIn();

  var alerts = $('.alerts');
  var alert = $('<div class="alert alert-success"></div>');

  alerts.empty();

  alert
    .html('<strong>Connected!</strong> Try running <code>curl -X POST -d "foo=baz" ' + url + '</code> to get some feedback.')
    .hide()
    .prependTo('.alerts')
    .fadeIn();
};

function processData (data) {
  $('.alerts').empty();

  try {
    data = JSON.stringify(data, undefined, 2);
  } catch (e) {}

  var id = new Date().getTime();
  var item = $('<a class="list-group-item" data-id="' + id + '">' + new Date().toLocaleTimeString() + '</a>');
  var content = $('<pre data-id="' + id + '">' + data + '</pre>');

  if ($('.waiting').length) {
    $('.waiting').remove();
    content.addClass('active');
    item.addClass('active');
  }

  item.hide().appendTo('.callback-nav').fadeIn();
  content.appendTo('.callback-content');
}

$('.callback-nav').on('click', 'a[data-id]', function(e){
  e.preventDefault();

  var id = $(this).data('id');
  $('.active').removeClass('active');
  $('[data-id="' + id + '"]').addClass('active');
});

primus.on('open', function () {
  notify.success();
});

channel.on('data', processData);