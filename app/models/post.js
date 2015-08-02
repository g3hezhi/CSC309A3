// app/models/post.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var postSchema = mongoose.Schema({
    
	writer       : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        description  : String,
        category     : String,
        type         : String,  //console/game/other
        topic        : String,
        comment      : String,
        price        : Number,
        exchange     : String,
        time         : {type: Date, default: Date.now },
        comments	 : [{ 
        		text: String,
        		postedBy: String
        }]
    
});



// create the model for posts and expose it to our app
module.exports = mongoose.model('Post', postSchema);
