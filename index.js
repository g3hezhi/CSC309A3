var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false }));

// https://codeforgeek.com/2014/09/handle-get-post-request-express-4/

// handle post request
app.post('/login',jsonParser,function (req, res) {
	console.log("LOGIN POST");
	
	// get user input
	console.log(req.body.id);
	console.log(req.body.pwd);


	// check database if username and password match


	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send("response to login post from server");
});


var server = app.listen(3000, function () {
  	var host = server.address().address;
  	var port = server.address().port;

  	console.log('Example app listening at http://%s:%s', host, port);
});