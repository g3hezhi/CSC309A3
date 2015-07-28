// SERVER

// Variables
var portNum = 3000;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var mongodb = require('mongodb');
var monk = require('monk');
// var db = monk('localhost:27017/CSC309A3');
var mongoClient = mongodb.MongoClient;
var mongourl = 'mongodb://localhost:27017/CSC309A3';

var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

/*	
var routes = require('./routes/index');
var users = require('.routes/users');
*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// https://codeforgeek.com/2014/09/handle-get-post-request-express-4/
// http://code.tutsplus.com/tutorials/getting-started-with-mongodb-part-1--net-22879

// MongoDb terms	collection = table, document = tuple 
/* Mongodb commands

show dbs
show collections

use DATABASE_NAME
db.dropDatabase()
db.createCollection(name, options)
db.COLLECTION_NAME.drop()
db.COLLECTION_NAME.insert(document)
db.COLLECTION_NAME.find()
db.mycol.find({key1:value1, key2:value2}).pretty()
db.mycol.find(
   {
      $or: [
	     {key1: value1}, {key2:value2}
      ]
   }
).pretty()
db.COLLECTION_NAME.update(SELECTIOIN_CRITERIA, UPDATED_DATA)
db.mycol.update({'title':'MongoDB Overview'},{$set:{'title':'New MongoDB Tutorial'}},{multi:true})
db.COLLECTION_NAME.save({_id:ObjectId(),NEW_DATA}) // replace tuple
db.COLLECTION_NAME.remove(DELLETION_CRITTERIA)
db.COLLECTION_NAME.remove(DELETION_CRITERIA,1) remove one tuple
db.mycol.remove() remove all tuples
db.mycol.find({},{"title":1,_id:0}) 1: show 0: hide
*/
var server = app.listen(portNum, function () {
  	var host = server.address().address;
  	var port = server.address().port;

  	console.log('Example app listening at http://%s:%s', host, port);
});



/*
******** HANDLE POST REQUEST
*/

// handle post request for login
app.post('/login',function (req, res) {
	console.log("LOGIN POST");
	
	// get user input
	console.log(req.body.id);
	console.log(req.body.pwd);

	/* check database if username and password match */
	// Use connect method to connect to the Server

	mongoClient.connect(mongourl, function (err, db) {
		assert.equal(null, err);
		/*
		insertDocument(db, function() {
		    db.close();
		});
		*/
		findUsers(db, function() {
		    db.close();
		});
		
	});

	
	//res.setHeader('Access-Control-Allow-Origin', '*');
	res.send("response to login post request from server");

});



// handle post request for user registration
app.post('/register',function (req, res) {

});

// handle post request for creating a post(ad)
app.post('/post',function (req, res) {

});


// handle post request for sending a message 
app.post('/msg',function (req, res) { 

});

/*
******** HANDLE GET REQUEST
*/


// handle get request for a specific user profile
app.get('/getProfile',function (req, res) { 
});

// handle get request for a specific post
app.get('/getPost',function (req, res) { 
});

// handle get request for a list of posts
app.get('/getPostList',function (req, res) { 

});

// handle get request for a message from a different user
app.get('/getMsg',function (req, res) { 

});


/*
********	HELPER FUNCTIONS
*/

// insert a row(tuple/document) into the 'users' collection
var insertDocument = function(db, callback) {
   db.collection('users').insertOne( {

				"first" : "zhi",
				"last" : "hu",
				"username" : "jkljlk",
				"passwod" : "pwd",
				"email" : "test@email.com",
				"credibility" : "8"

   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    
  });
};

// retrieve a row(tuple/document) from the database
var findUsers = function(db, callback) {
   var cursor =db.collection('users').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         //callback();
      }
   });
};