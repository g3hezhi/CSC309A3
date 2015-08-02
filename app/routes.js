// app/routes.js
var express = require('express');
var util = require('util');
var mongodb = require('mongodb');
var csurf = require('csurf');
var User            = require('../app/models/user');
var Post            = require('../app/models/post');
var Message         = require('../app/models/message');


var csrfProtection = csurf({cookie: true});
var mongoClient = mongodb.MongoClient;

var app      = express();
module.exports = function(app, passport) {

    //direct express to locate cssfiles 
    app.use(express.static(__dirname + '/public'));

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', isLoggedIn, function(req, res) {
	Post.find({}, function(err, posts) {
		console.log(posts.length);
		res.render('index.ejs', {
            user : req.user, // get the user out of session and pass to template
			posts : posts
        });
	});

    });
	
	app.post('/search', function(req, res) {
		req.sanitize('searchContent').escape();	
        // get input from user
        var searchContent = req.body.searchContent;
		console.log(searchContent)
		Post.find({topic: new RegExp(searchContent,'i')}, function(err, posts) {
			console.log(posts);
			res.render('product_list.ejs',{posts : posts});
		});
		 
	});
    
    // process the change
    app.get('/contact', function(req, res) {
        res.render('contact.ejs'); // load the contact.ejs file
    });


	app.get('/about', function(req, res) {
        res.render('about.ejs'); // load the about.ejs file
    });
	
    app.post('/index', passport.authenticate('local-login', {
        successRedirect : '/index', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })); // req.user property will be s

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form

    app.get('/login', csrfProtection, function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage'), csrfToken: req.csrfToken() }); 
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


    app.post('/register', function(req, res, next) {
        // prevent xss for security
        req.sanitize('username').escape();
        req.sanitize('password').escape();
        req.sanitize('email').escape();
        req.sanitize('pwd_confirmation').escape();
        
        req.checkBody('email', 'Your email address is not valid').isEmail();
        req.checkBody('username', 'Fill username').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            res.render('register.ejs', {message: util.inspect(errors)});            
        } else if(req.body.password != req.body.pwd_confirmation ) {
            res.render('register.ejs', {message: 'Two passwords do not match'});            
        } 
        else {
            next();
        }
        
    })

    // process the registeration form  
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // PRODUCT ==============================
    // =====================================
    
    app.get('/product', function(req, res) {
		var pid = req.query.pid;
		console.log(pid);	
		Post.findOne({_id:pid}, function(err, post) {
			console.log(post.topic);
			User.findOne({_id:post.writer}, function(err, user) {
				console.log(user.username);
				console.log(post.comments[0]);
				res.render('product.ejs',{post: post,
										  user: user
					});
				});
	
			

		});
	});
	app.post('/product', function(req, res) {
		req.sanitize('comment').escape();
        var comment = req.body.comment;
		
		var pid = req.query.pid;
		console.log(pid);	
		Post.findOne({_id:pid}, function(err, post) {
			//console.log(post.topic);
			post.comments.push({text: comment, postedBy : req.user});
			post.save(function(err, post) {
                if (err) return console.error(err);
                else {
				console.log(post);
				//res.render('profile.ejs', {
				//	user : req.user, // get the user out of session and pass to template
				//	post : posts
			//	});
				}
            });		
		});
	});




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
	app.get('/account_edit', isLoggedIn, function(req, res) {
        res.render('account_edit.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
    app.post('/account_edit', isLoggedIn,
         function(req, res) {
            // protection against xss for security
            req.sanitize('username').escape();
            req.sanitize('email').escape();
            req.sanitize('password').escape();
            req.sanitize('pwd_confirmation').escape();
        
            req.checkBody('email', 'Your email address is not valid').isEmail();
            req.checkBody('username', 'Fill username').notEmpty();
            req.checkBody('password', 'Fill password').notEmpty();
            
            // get input
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;

            var errors = req.validationErrors();
            if(errors) {
                res.render('account_edit.ejs', {message: util.inspect(errors)});            
            } else if(req.body.password != req.body.pwd_confirmation ) {
                res.render('account_edit.ejs', {message: 'Two passwords do not match'});            
            } else {
                var thisUser = req.user;
                thisUser.password = thisUser.generateHash(password);
                thisUser.username = username;
                thisUser.email = email;
                // save the user
                thisUser.save(function(err) {
                    if (err)
                        throw err;
                });
            }
    });
	app.get('/user_post', isLoggedIn, function(req, res) {
		var thisUser=req.user;
		User.findOne({'email': thisUser.email})
        .populate('posts')
        .exec(function (err, postArray) {
            if (err) return handleError(err);			
            //console.log(postArray[0]);
			    res.render('user_post.ejs', {
            user : req.user, // get the user out of session and pass to template  
			postArray : postArray
        });
        });
		
		

    });
	app.get('/user_inbox', isLoggedIn, function(req, res) {
		var thisUser=req.user;
		User.findOne({'email': thisUser.email})
        .populate('messages')
        .exec(function (err, msgArray) {
            if (err) return handleError(err);
            console.log(msgArray);
			res.render('user_inbox.ejs', {
            user : req.user, // get the user out of session and pass to template  
			msgArray : msgArray
			});
        });
    });
	app.get('/user_send', isLoggedIn, function(req, res) {
		console.log('user send work');
		res.render('user_send.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
	app.post('/send', function(req, res) {   
		req.sanitize('msgto').escape();
        req.sanitize('content').escape();
        
		req.checkBody('msgto', 'Fill receiver').notEmpty();
        req.checkBody('content', 'Fill content').notEmpty();
		
        // get input from user
        var msgto = req.body.msgto;
        var content = req.body.content;	
		User.findOne({email:msgto}, function(err, receiver) {
			if(!receiver){
				console.log('no user found');
				res.render('send.ejs', {message: 'No user found'});            
			}
			else{
			var thisUser = req.user;    //logged in user         
            var newMsg = new Message({
                from: thisUser.email,
                to: receiver.email, 
                content: content 
				});

            // save in the db
            newMsg.save(function(err, newMsg) {
                if (err) return console.error(err);
                else {            
                    // update the user data in the USER COLLECTION
                    receiver.messages.push(newMsg);
                    receiver.save(function(err, receiver) {
                        if (err) return console.error(err);
                        else {
							console.log(newMsg);
							        res.render('profile.ejs', {
											user : req.user // get the user out of session and pass to template
									});
                        }
                    });
                }
            });
			}
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

        req.sanitize('category').escape();
        req.sanitize('item').escape();
        req.sanitize('topic').escape();
        req.sanitize('comment').escape();
        req.sanitize('price').escape();

        req.checkBody('topic', 'Fill topic').notEmpty();
        req.checkBody('comment', 'Fill comment').notEmpty();

        // get input from user
        var category = req.body.category;
        var item = req.body.item;
        var topic = req.body.topic;
        var comment = req.body.comment;
        var price = req.body.price;

        var errors = req.validationErrors();
        if(errors) {
            res.render('post.ejs', {message: util.inspect(errors)});            
        } else if(req.body.password != req.body.pwd_confirmation ) {
            res.render('post.ejs', {message: 'Two passwords do not match'});            
        } else {
            var thisUser = req.user;    //logged in user
                    
            var newPost = new Post({
                writer: thisUser._id,
                category: category, 
                topic: topic, 
                comment: comment,
                price : price});

            // save in the db
            newPost.save(function(err, newPost) {
                if (err) return console.error(err);
                else {            
                    // update the user data in the USER COLLECTION
                    thisUser.posts.push(newPost);
                    thisUser.save(function(err, thisUser) {
                        if (err) return console.error(err);
                        else {
                            	Post.find({}, function(err, posts) {
									console.log(posts.length);
									res.render('index.ejs', {
										user : req.user, // get the user out of session and pass to template
										posts : posts
									});
								});
                        }
                    });
                }
            });
        }                        

    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

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

    // if they aren't redirect them to the login page
    res.redirect('/login');
}
