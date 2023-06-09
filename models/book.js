const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    name:{
        type: String,
        required: "Enter Book Title",
        default: "-"
    },
    author:{
        type: String,
        default: "-"
    },
    accID:{
        type: String,
        required: "Enter Book Accession Number",
        unique:true
    },
    shelf:{
        type: Schema.Types.ObjectId,
        ref: 'Shelf'
    }
})

module.exports = {
    bookSchema
}