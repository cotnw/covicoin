const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user_token: {
        type: String,
        required: true
    },
    tweets: {
        type: Array,
        required: true
    },
    leads_confirmed: {
        type: Number,
        default: 0
    },
    covicoins: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    }
})

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;