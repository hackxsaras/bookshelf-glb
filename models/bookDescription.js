const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookDescriptionSchema = new Schema({
    title:{
        type: String,
        required: "Enter Book Title"
    },
    class:{
        type: String
    },
    author:{
        type: String,
        // required: "Enter Author Name"
    },
    publisher:{
        type: String
    }
});
module.exports = {
    bookDescriptionSchema
}