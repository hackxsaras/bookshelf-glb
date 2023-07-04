const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shelfSchema = new Schema({
    name:{
        type: String,
        required: "Enter Shelf Name"
    }
})

module.exports = {
    shelfSchema
}