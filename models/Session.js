const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    tweets: {
        type: Object,
        required: true
    },
    leads_confirmed: {
        type: Number,
        required: true
    },
    covicoins: {
        type: Number,
        required: true
    }
})

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;