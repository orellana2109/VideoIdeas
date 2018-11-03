const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//create our model and call it idea and pass it the IdeaSchema
mongoose.model('ideas', IdeaSchema);