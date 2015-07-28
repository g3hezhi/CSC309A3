var http = require('http');

function parseCookies (request) {
    var list = {},
        allCookies = request.headers.cookie;

    allCookies && allCookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}


http.createServer(function (request, response) {

  // To Read a Cookie
  //var cookies = parseCookies(request);

  // To Write a Cookie
  response.writeHead(200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/plain'
  });
  response.end('Cookie has been set.\n');
  //response.end('Previous Cookie:\n'+cookies.mycookie);
}).listen(3000);

console.log('Server running at http://127.0.0.1:3000/');