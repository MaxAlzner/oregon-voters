
var http = require('http');
var path = require('path');

var express = require('express');

var app = express();

var whitelist = [
  'html', 'htm', 'js', 'css',
  'jpg', 'jpeg', 'png', 'gif',
  'json', 'csv', 'doc', 'docx', 'pdf'
];
console.log(new RegExp('/^.*\.(' + whitelist.join('|') + ')$/'));

app
  .get('/', function (request, response) {
    console.log('SEND', __dirname + '/client/index.html');
    response
      .status(200)
      .set('Content-Type', 'text/html')
      .sendFile(__dirname + '/client/index.html', function (err) {
        if (err) {
            console.log('ERROR', err);
            response.status(err.statusCode);
        }
        
        response.end();
      });
  })
  .get(new RegExp('/^.*\.(' + whitelist.join('|') + ')$/'), function (request, response) {
    console.log('SEND', __dirname + '/client/' + request.originalUrl);
    response.sendFile(__dirname + '/client/' + request.originalUrl, function (err) {
        if (err) {
            console.log('ERROR', err);
            response.status(err.statusCode);
        }
        
        response.end();
    });
  });
  
var server = app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
  var addr = server.address();
  console.log('Server running at', addr.address + ':' + addr.port);
});
