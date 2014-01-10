var Primus = require('primus.io');
var http = require('http');
var static = require('node-static');
var file = new static.Server('./public');
var port = process.env.PORT || 3000;

var server = http.createServer(function (req, res) {
  if (req.method == 'POST') {
    req.on('data', function (chunk) {
      var data = chunk.toString();
      try {
        data = JSON.parse(data);
      } catch (e) {}
      callbacks.write(data);
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ok');
  } else {
    req.addListener('end', function () {
      file.serve(req, res);
    }).resume();
  }
});

var primus = new Primus(server, { transformer: 'websockets', parser: 'JSON' });
var callbacks = primus.channel('callbacks');

server.listen(port);

console.log('triggerback listening on ' + port);
