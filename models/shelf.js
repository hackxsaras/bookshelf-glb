const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shelfSchema = new Schema({
    name:{
        type: String,
        required: "Enter Shelf Name"
    },
    accID:{
        type: String, 
        unique: true,
        required: "Enter Shelf Accession Number"
    },
    subject: {
        type: String
    }

})

module.exports = {
    shelfSchema
}