const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    creatorID:{
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
        trim: true
    },
    // timeStamps: true
});


module.exports = mongoose.model('Entries', entrySchema);