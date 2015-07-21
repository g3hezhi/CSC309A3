// SERVER

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongodb = require('mongodb');
var monk = require('monk');
// var db = monk('localhost:27017/CSC309A3');
var mongoClient = mongodb.MongoClient;
var mongourl = 'mongodb://localhost:27017/CSC309A3';
/*	
var routes = require('./routes/index');
var users = require('.routes/users');
*/

app.use(bodyParser.urlencoded({ extended: false }));
// Make our db accessible to our router
/*app.use(function(req,res,next){
    req.db = db;
    next();
});
*/
// https://codeforgeek.com/2014/09/handle-get-post-request-express-4/

// handle post request
app.post('/login',function (req, res) {
	console.log("LOGIN POST");
	
	// get user input
	console.log(req.body.id);
	console.log(req.body.pwd);


	/* check database if username and password match */
	// Use connect method to connect to the Server
	mongoClient.connect(mongourl, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', mongourl);

	    // do some work here with the database.

	    //Close connection
	    db.close();
	  }
	});

	// send response to the client
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send("response to login post request from server");
	// res.send("success or fail");
});


var server = app.listen(3000, function () {
  	var host = server.address().address;
  	var port = server.address().port;

  	console.log('Example app listening at http://%s:%s', host, port);
});