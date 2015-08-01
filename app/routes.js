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
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })); // req.user property will be set to the authenticated user if succesful
    /* Setting the failureFlash option to true instructs Passport to flash an error message 
    using the message given by the strategy's verify callback, if any.
    */

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
    app.post('/account_edit', isLoggedIn,
         function(req, res) {
            // get input
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;

            var thisUser = req.user;
            thisUser.password = thisUser.generateHash(password);
            thisUser.username = username;
            thisUser.email = email;
                // save the user
                thisUser.save(function(err) {
                    if (err)
                        throw err;
                    
                });

    });
	
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
	
	// process the change
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


    // process the post form
    app.post('/post', function(req, res) {
        // get input from user
        var category = req.body.category;
        var item = req.body.item;
        var topic = req.body.topic;
        var comment = req.body.comment;

        var thisUser = req.user;    //logged in user
        
        // save in the post collection(table)
        var newPost = new Post({
            writer: thisUser,
            category: category, 
            topic: topic, 
            comment: comment});

        newPost.save(function(err, newPost) {
            if (err) return console.error(err);
            else {
                Post.find({})
                    .populate('writer')
                    .exec(function(error, posts) {
                        console.log(JSON.stringify(posts, null, "\t"))
            })                                            
                // update the user data in the USER COLLECTION
                thisUser.posts.push(newPost);
                thisUser.save(function(err, thisUser) {
                    if (err) return console.error(err);
                    else {
                        User.find({})
                            .populate('posts')
                            .exec(function(error, users) {
                                console.log(JSON.stringify(users, null, "\t"))
                            })                        
                        //console.log(JSON.stringify(users, null, "\t"))    
                        res.render('index.ejs'); // load the index.ejs file                            
                    }
                });
            }
        });                        
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
/*    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
*/

    app.get('/auth/google/callback',
            passport.authenticate('google', {failureRedirect : '/'}), 
            function(req, res) {
                console.log("HERE");
                //console.log(req.user);                                 
                res.redirect('/profile');
            });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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
