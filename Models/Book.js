const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    creatorID:{
        type: String,
        required: true,
        trim: true
    },
    entries:[{
        entryTitle:{
            type: String,
            required: true,
            trim: true
        },
        entryCreatorID:{
            type: String,
            required: true,
            trim: true
        },
        bookID:{
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true
        },
        details:{
            type: String,
            trim: true
        },
        recipient:{
            type: String,
            required: true,
            trim: true
        },
        type:{
            type: String,
            required: true,
            trim: true,
        },
        entryCreationDate:{
            type: Date,
            default: Date.now
        }
    }],
    creationDate: {
        type: Date,
        default: Date.now
    },
    totalReceived: {
        type: Number,
        default: 0
    },
    totalDept:{
        type: Number,
        default: 0
    },
    totalPaid:{
        type: Number,
        default: 0
    },
    monthlyReceived:{
        type: Number,
        default: 0
    },
    monthlyPaid:{
        type: Number,
        default: 0
    },
    users:{
        type: Array,
        default: []
    }
});


module.exports = mongoose.model('Books', bookSchema);