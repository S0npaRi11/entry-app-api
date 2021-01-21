const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    books:{
        type: Array,
        default: []
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    messages:[{
        msg:{
            type: String,
            required: true,
            trim: true
        },
        acceptedURL:{
            type: String,
            trim: true,
            // required: true
        },
        deniedURL:{
            type: String,
            trim: true
        },
        senderID:{
            type: String,
            // required: true,
            trim: true,
        },
        senderEmail:{
            type: String,
            trim: true,
            required: true
        },
        senderFirstName:{
            type: String,
            trim: true,
            required: true
        },
        senderLastName:{
            type: String,
            trim: true,
            required: true
        },
        tag:{
            type: Array,
            default: []
        }
    }]
});


module.exports = mongoose.model('Users', userSchema);