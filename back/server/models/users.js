const mongoose = require('mongoose')

const { Schema } = mongoose

const personSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    userID:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    PW:{
        type: String,
        required: true,
    },
    birth:{
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    lastModifiedAt:{
        type: Date,
        default: Date.now,
    },
})

const Person = mongoose.model('person', personSchema)
module.exports = Person