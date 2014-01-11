var fs = require('fs');

// socket
var Primus = require('primus.io');
var channels = {};

// server
var union = require('union');
var ecstatic = require('ecstatic');
var director = require('director');

var port = process.env.PORT || 3000;
var router = new director.http.Router();
var server = union.createServer({
  before: [
    ecstatic({
      root       : __dirname + '/public',
      baseDir    : '/',
      cache      : 3600,
      showDir    : false,
      autoIndex  : true,
      defaultExt : 'html',
      gzip       : true
    }),
    function (req, res) {
      var found = router.dispatch(req, res);

      // 404
      if (!found) {
        res.emit('next');
      }
    }
  ]
});

function newId () {
  return Math.floor((1 + Math.random()) * new Date().getTime()).toString(16).substring(4);
}

// routes
router.get(/\/new/, function () {
  this.res.redirect('/' + newId());
});

router.get(/\/(\w+)/, function (id) {
  var channel = channels[id] = primus.channel(id);

  channel.on('connection', function (spark) {
    console.log('[CONNECT ' + id + '] client ID ' + spark.id);
  });

  this.res.setHeader('Content-Type', 'text/html');
  fs.createReadStream(__dirname + '/public/bin.html').pipe(this.res);
});

router.post(/\/(\w+)/, function (id) {
  var data = this.req.body;

  try {
    data = JSON.stringify(data, undefined, 2);
  } catch (e) {}

  console.log('[POST    ' + id + '] ' + data);

  try {
    data = JSON.parse(data);
  } catch (e) {}

  if (channels[id]) {
    channels[id].write(data);
  } else {
    console.log('channel ' + id + ' doesn\'t exist');
  }

  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.end();
});

var primus = new Primus(server, { transformer: 'websockets', parser: 'JSON' });

server.listen(port);

console.log('geobin listening on ' + port);
