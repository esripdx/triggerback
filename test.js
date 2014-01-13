var request = require('request');
var argv = require('optimist').argv;


var options = {
  uri: argv.url,
  method: 'POST',
  json: {
    "triggerId":"6fd01180fa1a012f27f1705681b27197",
    "condition": {
      "direction": "enter",
      "geo": {
        "latitude": "45.5165",
        "longitude": "-122.6764",
        "distance": "240"
      }
    }
  }
};

request(options);
