/*
The first argument is the singular name of the collection your model is for. 
Mongoose automatically looks for the plural version of your model name. 
*/

// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var p     = require('./post');
var m  = require('./message');

    // =========================================================================
    // USER ============================================================
    // =========================================================================


// define the schema for our user model
var userSchema = mongoose.Schema({
// EX) // comments: [{ body: String, date: Date }],
// MAKE ADJUSTMENT
// TODO FIND OUT HOW TO RELATE USER AND HIS/HER POST/MSG
// http://mongoosejs.com/docs/populate.html 
    local            : {
        email        : {type: String, unique: true},
        username     : {type: String, unqiue: true},
        password     : String,
        first        : String,
        last         : String,
        age          : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

    messages         : {
        message      : [Object] // array of messages
    },


    posts            : {
        post         : [Object] // array of posts
    }


});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);