const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    description:{
        type: Schema.Types.ObjectId,
        ref: 'BookDescription'
    },
    accID:{
        type: String,
        required: "Enter Book Accession Number",
        unique:true
    },
    shelf:{
        type: Schema.Types.ObjectId,
        ref: 'Shelf'
    },
    row:{
        type: String
    }
})

module.exports = {
    bookSchema
}