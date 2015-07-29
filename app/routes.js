// app/routes.js
var express = require('express');
var app      = express();
var mongodb = require('mongodb');

var User            = require('../app/models/user');
var Post            = require('../app/models/post');
var Message         = require('../app/models/message');

var mongoClient = mongodb.MongoClient;
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

	 app.get('/contact', function(req, res) {
        res.render('contact.ejs'); // load the contact.ejs file
    });
	app.get('/about', function(req, res) {
        res.render('about.ejs'); // load the about.ejs file
    });
	
    //direct express to locate cssfiles 
    app.use(express.static(__dirname + '/public'));
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {        
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the registration form
    app.get('/register', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('register.ejs', { message: req.flash('signupMessage') });
    });

    // process the registeration form
    // app.post('/register', do all our passport stuff here);    
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
	// =====================================
    // EDIT ACCOUNT =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	app.get('/account_edit', isLoggedIn, function(req, res) {
        res.render('account_edit.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
	// app.post('/account_edit', do all our passport stuff here);    
    app.post('/account_edit', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/account_edit', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
	// =====================================
    // EDIT USER INFORMATION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	app.get('/userinfo_edit', isLoggedIn, function(req, res) {
        res.render('userinfo_edit.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
	// app.post('/userinfo_edit', do all our passport stuff here);    
    app.post('/userinfo_edit', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/userinfo_edit', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
	// =====================================
    // POSTING =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	app.get('/posting', isLoggedIn, function(req, res) {
        res.render('posting.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // POSTING ===============================
    // =====================================
    // show the post form
    app.get('/post', function(req, res) {        
        // render the page and pass in any flash data if it exists
        res.render('posting.ejs'); 
    });

    // process the post form
    app.post('/post', function(req, res) {
        // get input from user
/*
        console.log(req.body.category);
        console.log(req.body.item);
        console.log(req.body.topic);
        console.log(req.body.comment);
*/
        var category = req.body.category;
        var item = req.body.item;
        var topic = req.body.topic;
        var comment = req.body.comment;

        // save in the post collection(table)
        var newPost = new Post({category: category, topic: topic, comment: comment});
        newPost.save(function(err, newPost) {
            if (err) return console.error(err);
            else {
                console.log("post save success");
            }
        });


        
        // update the user data in the USER COLLECTION




        // alert the user on success and redirect
        res.render('index.ejs'); // load the index.ejs file
    });


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// insert a row(tuple/document) into the 'post' collection
var insertPost = function(db, callback) {
   db.collection('posts').insertOne( {

        "writer"       : "some1", // user?? or objectid?
        "description"  : "something"

   }, function(err, result) {
    //assert.equal(err, null);
    console.log("Inserted a document into the 'posts' collection.");
    
  });
};
