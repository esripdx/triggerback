var request = require('request');
var argv = require('optimist').argv;


var options = {
  uri: argv.url,
  method: 'POST',
  json: {
    "geo": {
      "latitude": "45.5165",
      "longitude": "-122.6764"
    }
  }
};

request(options);
