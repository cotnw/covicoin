const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    tweets: {
        type: Array,
        required: true
    },
    leads_confirmed: {
        type: Number,
        required: true
    },
    covicoins: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;