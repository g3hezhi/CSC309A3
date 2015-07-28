/*
The first argument is the singular name of the collection your model is for. 
Mongoose automatically looks for the plural version of your model name. 
*/

// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


    // =========================================================================
    // POST ============================================================
    // =========================================================================

var postSchema = mongoose.Schema({

    post             : {
        writer       : String, // user?? or objectid?
        description  : String,
        comment      : String,
        price        : Number,
        exchange     : String,
        time         : Date
    }

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);


    // =========================================================================
    // MESSAGE ============================================================
    // =========================================================================

// define the schema for our user model
var messageSchema = mongoose.Schema({

    message             : {
        from         : String, //user ?? or objectid?
        to           : String, //user??
        isRead       : Boolean,
        content      : String,
        time         : Date     // date: { type: Date, default: Date.now },
    }

});

// http://mongoosejs.com/docs/subdocs.html

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);



    // =========================================================================
    // USER ============================================================
    // =========================================================================


// define the schema for our user model
var userSchema = mongoose.Schema({
// UNFINISHED
// TODO FIND OUT HOW TO RELATE USER AND HIS/HER POST/MSG
    local            : {
        email        : String,
        password     : String,
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
    posts            : {
        post         : [postSchema]
    },
    messages         : {
        message      : [messageSchema]
    }



// http://mongoosejs.com/docs/guide.html
// comments: [{ body: String, date: Date }],
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

