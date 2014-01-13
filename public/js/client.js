(function(){

var primus = new Primus(location.origin.replace(/^http/, 'ws'));
var url = window.location.toString();
var binId = window.location.pathname.substring(1);
var channel = primus.channel(binId);
var notify = {};
var map;
var features;

initMap();

if (geobin.support.localStorage) {
  var binStore = geobin.store.history[binId] = geobin.store.history[binId] || {};
  geobin.save();

  if (Object.keys(binStore).length) {
    for (var id in binStore) {
      if (binStore.hasOwnProperty(id)) {
        console.log(id);
        var ts = new Date(+id).toLocaleString();
        var item = $('<a class="list-group-item" data-id="' + id + '">' + ts + '</a>');
        var content = $('<pre class="json" data-id="' + id + '">' + JSON.stringify(binStore[id], undefined, 2) + '</pre>');
        searchForGeo(binStore[id]);

        if ($('.waiting').length) {
          $('.waiting').remove();
          content.addClass('active');
          item.addClass('active');
        }

        item.hide().appendTo('.callback-nav').fadeIn();
        content.appendTo('.callback-content');
      }
    }
  }
}

notify.success = function () {
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

  var id = new Date().getTime();
  var ts = new Date(id).toLocaleString();

  if (geobin.support.localStorage) {
    geobin.store.history[binId][id] = data;
    geobin.save();
  }

  try {
    data = JSON.stringify(data, undefined, 2);
  } catch (e) {}

  searchForGeo(JSON.parse(data));

  var item = $('<a class="list-group-item" data-id="' + id + '">' + ts + '</a>');
  var content = $('<pre class="json" data-id="' + id + '">' + data + '</pre>');

  if ($('.waiting').length) {
    $('.waiting').remove();
    content.addClass('active');
    item.addClass('active');
  }

  item.hide().appendTo('.callback-nav').fadeIn();
  content.appendTo('.callback-content');
}

function syntaxHighlight(json) {
  console.log('highlighting');
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function initMap () {
  map = L.map('map', {
    center: [0,0],
    zoom: 1,
    scrollWheelZoom: true,
    zoomControl: false
  });

  features = new L.FeatureGroup();

  map.addLayer(features);

  new L.Control.Zoom({ position: 'topright' }).addTo(map);

  L.esri.basemapLayer('Streets').addTo(map);
}

function searchForGeo (data) {
  console.log('hi', data);
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    return;
  }
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      console.log(key);
      var obj = data[key];
      if (key === 'geo') {
        mapGeo(obj);
      } else {
        searchForGeo(obj);
      }
    }
  }
}

function mapGeo (geo) {
  var layer;
  if (geo.latitude, geo.longitude, geo.distance) {
    layer = new L.Circle([geo.latitude, geo.longitude], geo.distance);
  }
  else if (geo.geojson) {
    layer = new L.GeoJSON(geo.geojson);
  }
  layer.addTo(features);
  var bounds = layer.getBounds();

  map.fitBounds(bounds);
}

$('.callback-nav').on('click', 'a[data-id]', function(e){
  e.preventDefault();

  var id = $(this).data('id');
  $('.active').removeClass('active');
  $('[data-id="' + id + '"]').addClass('active');
});

primus.on('open', function () {
  $('.status').text('is listening at ' + url).fadeIn();

  if (!Object.keys(binStore).length) {
    notify.success();
  }
});

channel.on('data', processData);

})();