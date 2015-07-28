// app/models/message.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var msgSchema = mongoose.Schema({

    message             : {
        from         : String, //user ??
        to           : String, //user??
        isRead       : boolean,
        content      : String,
        time         : Date 	// date: { type: Date, default: Date.now },
    }

});

// http://mongoosejs.com/docs/subdocs.html

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', msgSchema);
