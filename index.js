var Primus = require('primus.io');
var express = require('express');
var http = require('http');


var app = express();
var server = http.createServer(app);
var primus = new Primus(server, { transformer: 'websockets', parser: 'JSON' });

app
  .use(express.static(__dirname + '/public'))
  .use(express.bodyParser())
  .use(express.favicon())
  .use(express.bodyParser())
  .use(express.methodOverride())
  .configure('development', function(){
    app
      .use(express.logger('dev'))
      .use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  })
  .configure('production', function(){
    app
      .use(express.logger())
      .use(express.errorHandler());
  })
  .use(app.router);

app.post('*', function(req, res){
  primus.write(req.body);
  res.end();
});

server.listen(3000);

console.log('triggerback listening on 3000');
