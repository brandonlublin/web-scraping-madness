var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true,
    }
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Article model
module.exports = Comment;