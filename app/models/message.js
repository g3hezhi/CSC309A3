// app/models/message.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var messageSchema = mongoose.Schema({

        from         : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        to           : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        isRead       : Boolean,
        content      : String,
        time         : Date     // date: { type: Date, default: Date.now },
    

});

// http://mongoosejs.com/docs/subdocs.html

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);
