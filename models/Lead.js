const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    user_token: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    contact_name: {
        type: String,
        required: false
    },
    contact_number1: {
        type: String,
        required: true
    },
    contact_number2: {
        type: String,
        required: false
    },
    additional_info: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    }
})

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;